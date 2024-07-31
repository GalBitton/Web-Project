// middlewares/auth.middlewares.js
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

class AuthMiddleware {
    constructor(config, logger) {
        this._config = config;
        this._logger = logger;
        this.JWT_REFRESH_SECRET = this._config.get('jwt-refresh-token-secret');

        // Bind methods to ensure 'this' context is correct
        this.authenticateJWT = this.authenticateJWT.bind(this);
    }

    async authenticateJWT(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        let token;
        try {
            token = authHeader.split(' ')[1];
        } catch (err) {
            return next(err);
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        jwt.verify(token, this.JWT_REFRESH_SECRET, async (err, decodedToken) => {
            if (err) {
                if (err instanceof jwt.TokenExpiredError) {
                    // Edge case for logout.
                    if (req.url === '/logout') {
                        // Invalidate the refresh token
                        res.cookie('refreshJWT', '', {
                            httpOnly: true,
                            sameSite: 'none',
                            secure: true,
                            expires: new Date(0)
                        });
                        return res.status(200).json({ message: 'Token expired, re-login to generate a new one. '});
                    }
                    return res.status(401).json({ message: 'Token expired' });
                } else {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
            }

            if (!decodedToken || !decodedToken.userId) {
                this._logger.error(`User not found. Fake token detected: ${req}`);
                return res.status(403).json({ message: 'Forbidden' });
            }

            if (!mongoose.Types.ObjectId.isValid(decodedToken.userId)) {
                return res.status(400).json({ message: 'Invalid user ID' });
            }

            req.user = decodedToken.userId
            next();
        });
    }
}

export default AuthMiddleware;
