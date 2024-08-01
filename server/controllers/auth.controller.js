import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../database/models/User.model.js';
import { convertExpirationDateToMilliseconds } from '../utils/expirationDateConverter.js';

class AuthController {
    constructor(config, logger) {
        this._config = config;
        this._logger = logger;
        this.JWT_AWT_SECRET = this._config.get('jwt-access-token-secret');
        this.JWT_REFRESH_SECRET = this._config.get('jwt-refresh-token-secret');
        this._OAuthClient = new OAuth2Client(this._config.get('google_oauth_client_id'));

        // Bind methods to ensure 'this' context is correct
        this.register = this.register.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.authenticateGoogleToken = this.authenticateGoogleToken.bind(this);
        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
    };

    async register(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'You must specify an email and password' });
            }

            const user = new User({
                email,
                password,
                googleSignIn: false
            });
            await user.save();

            const accessToken = jwt.sign({ userId: user._id }, this.JWT_AWT_SECRET, {
                expiresIn: this._config.get('access_expiration'),
            });

            const refreshToken = jwt.sign({ userId: user._id }, this.JWT_REFRESH_SECRET, {
                expiresIn: this._config.get('refresh_expiration'),
            });

            user.refreshToken = refreshToken;

            await user.save();

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: convertExpirationDateToMilliseconds(this._config.get('refresh_expiration')),
            });

            res.status(201).send({
                accessToken,
                userId: user._id,
                email: user.email
            });
        } catch (error) {
            this._logger.error(`Error registering user: ${error}, request: ${req}`);
            res.status(400).send({ error: error.message });
        }
    };

    async authenticate(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({
                email
            }).select('+password +googleSignIn +refreshToken').exec();

            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            if (user.googleSignIn) {
                return res.status(401).json({ error: 'Account associated with Google Sign In' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const accessToken = jwt.sign({ userId: user._id }, this.JWT_AWT_SECRET, {
                expiresIn: this._config.get('access_expiration'),
            });

            const refreshToken = jwt.sign({ userId: user._id }, this.JWT_REFRESH_SECRET, {
                expiresIn: this._config.get('refresh_expiration'),
            });

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: convertExpirationDateToMilliseconds(this._config.get('refresh_expiration'))
            });

            res.status(200).json({
                accessToken,
                userId: user._id,
                email
            });

            user.refreshToken = refreshToken;
            await user.save();

        } catch (error) {
            this._logger.error(`Error authenticating user: ${error}, request: ${req}`);
            res.status(500).json({ error: error.message });
        }
    };

    async authenticateGoogleToken(req, res) {
        try {
            const { idToken } = req.body;
            let email;

            try {
                const ticket = await this._OAuthClient.verifyIdToken({
                    idToken,
                    audience: this._config.get('google_oauth_client_id'),
                });

                const payload = ticket.getPayload();
                email = payload.email;
            } catch (error) {
                this._logger.error(`Error validating ID token: ${error}`, req);
                throw error;
            }

            if (!email) {
                return res.status(500).json({ error: 'Error authenticating with Google.' });
            }

            let user = await User.findOne({
                email
            }).select('+googleSignIn +refreshToken email').exec();

            if (user && !user.googleSignIn) {
                return res.status(401).json({ error: 'Not a Google account.' });
            }

            if (!user) {
                user = new User({
                    email,
                    googleSignIn: true,
                });
                await user.save();
            }

            const accessToken = jwt.sign({ userId: user._id }, this.JWT_AWT_SECRET, {
                expiresIn: this._config.get('access_expiration'),
            });

            const refreshToken = jwt.sign({ userId: user._id }, this.JWT_REFRESH_SECRET, {
                expiresIn: this._config.get('refresh_expiration'),
            });
            user.refreshToken = refreshToken;

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: convertExpirationDateToMilliseconds(this._config.get('refresh_expiration'))
            });

            await user.save();

            res.status(200).json({
                accessToken,
                email,
                userId: user._id,
            });
        } catch (error) {
            this._logger.error(`Error authenticating user with Google: ${error}, request: ${req}`);
            return res.status(500).json({ error: error.message });
        }
    };

    async refresh(req, res) {
        try {
            const refreshToken = req.cookies.jwt;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            jwt.verify(refreshToken, this.JWT_REFRESH_SECRET, async (err, user) => {
                if (err) {
                    return res.status(406).json({ message: 'Unauthorized' });
                }

                const storedUser = await User.findOne({
                    _id: user.userId
                }).select('+refreshToken').exec();

                if (!storedUser || storedUser.refreshToken !== refreshToken) {
                    return res.status(403).json({ message: 'Forbidden' });
                }

                const newAccessToken = jwt.sign({ userId: user.userId }, this.JWT_AWT_SECRET, {
                    expiresIn: this._config.get('access_expiration'),
                });

                res.status(200).json({ accessToken: newAccessToken });
            });
        } catch (error) {
            this._logger.error(`Error refreshing access token: ${error}, request: ${req}`);
            res.status(500).json({ error: error.message });
        }
    };

    async logout(req, res) {
        try {
            const user = await User.findOne({
                _id: req.user
            }).select('+refreshToken').exec();

            if (!user) {
                return res.status(400).json({ error: 'Invalid user' });
            }

            res.cookie('jwt', '', {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                expires: new Date(0) // Set the cookie to expire immediately
            });

            user.refreshToken = null;
            await user.save();
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            this._logger.error(`Error logging out: ${error}, request: ${req}`);
            res.status(500).json({ error: error.message });
        }
    };
};

export default AuthController;
