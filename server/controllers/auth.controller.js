import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../db/models/User.model.js';
import container from '../containerConfig.js';
import { convertExpirationDateToMilliseconds } from '../utils/expirationDateConverter.js';

const authConfig = container.get('authConfig');
const logger = container.get('logger');
const JWT_AWT_SECRET = authConfig.get('jwt-access-token-secret');
const JWT_REFRESH_SECRET = authConfig.get('jwt-refresh-token-secret');
const client = new OAuth2Client(authConfig.get('google_oauth_client_id'));

async function register(req, res) {
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

        const accessToken = jwt.sign({ userId: user._id }, JWT_AWT_SECRET, {
            expiresIn: authConfig.get('access_expiration'),
        });

        const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
            expiresIn: authConfig.get('refresh_expiration'),
        });

        user.refreshToken = refreshToken;

        await user.save();

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: convertExpirationDateToMilliseconds(authConfig.get('refresh_expiration')),
        })

        res.status(201).send({
            message: 'User registered successfully',
            accessToken,
            refreshToken,
            userId: user._id,
            email: user.email
        });
    } catch (error) {
        logger.error(`Error registering user: ${error}, request: ${req}`);
        res.status(400).send({ error: error.message });
    }
}

async function authenticate (req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            email
        }).select('+password +googleSignin +refreshToken').exec();

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        if (user.googleSignin) {
            return res.status(401).json({ error: 'Account associated with Google Sign In' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const accessToken = jwt.sign({ userId: user._id }, JWT_AWT_SECRET, {
            expiresIn: authConfig.get('access_expiration'),
        });

        const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
            expiresIn: authConfig.get('refresh_expiration'),
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: convertExpirationDateToMilliseconds(authConfig.get('refresh_expiration'))
        })

        res.status(200).json({
            accessToken,
            refreshToken,
            userId: user._id,
            email
        });

        user.refreshToken = refreshToken;
        await user.save();

    } catch (error) {
        logger.error(`Error authenticating user: ${error}, request: ${req}`);
        res.status(500).json({ error: error.message });
    }
}

async function authenticateGoogleToken (req, res) {
    try {
        const { token } = req.body;
        let email, isNewUser;

        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: authConfig.get('google_oauth_client_id'),
            });

            const payload = ticket.getPayload();
            email = payload.email;
        } catch (error) {
            logger.error(`Error validating ID token + ${error}`, req);
            throw error;
        }

        if (!email) {
            return res.status(500).json({ error: 'Error authenticating with Google.' });
        }

        let user = await User.findOne({
            email
        }).select('+googleSignin +refreshToken email').exec();

        if (user && !user.googleSignin) {
            return res.status(401).json({ error: 'Not a Google account.' });
        }

        if (!user) {
            user = new User({
                email,
                googleSignin: true,
            });
            await user.save();
        }

        const accessToken = jwt.sign({ userId: user._id }, JWT_AWT_SECRET, {
            expiresIn: authConfig.get('access_expiration'),
        });

        const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
            expiresIn: authConfig.get('refresh_expiration'),
        });
        user.refreshToken = refreshToken;

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: convertExpirationDateToMilliseconds(authConfig.get('refresh_expiration'))
        })

        await user.save();

        res.status(200).json({
            accessToken,
            refreshToken,
            email,
            userId: user._id,
        });
    } catch (error) {
        logger.error(`Error authenticating user with Google: ${error}, request: ${req}`);
        return res.status(500).json({ error: error.message });
    }
}

async function refresh (req, res) {
    try {
        const refreshToken = req.cookies.jwt || req.body.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, user) => {
            if (err) {
                return res.status(406).json({ message: 'Unauthorized' });
            }

            const storedUser = await User.findOne({
                _id: user.userId
            }).select('+refreshToken').exec();

            if (!storedUser || storedUser.refreshToken !== refreshToken) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const newAccessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, {
                expiresIn: authConfig.get('access_expiration'),
            });

            res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        logger.error(`Error refreshing access token: ${error}, request: ${req}`);
        res.status(500).json({ error: error.message });
    }
}

async function logout (req, res) {
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
        })

        user.refreshToken = null;
        await user.save();
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error, req);
        res.status(500).json({ error: error.message });
    }
}

export {
    register,
    authenticate,
    authenticateGoogleToken,
    refresh,
    logout
}