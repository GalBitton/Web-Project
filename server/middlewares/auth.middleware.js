// middlewares/auth.middlewares.js
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import container from '../containerConfig.js';
const JWT_REFRESH_SECRET = container.get('JWT_REFRESH_SECRET');
const logger = container.get('logger');

async function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, JWT_REFRESH_SECRET, async (err, decodedToken) => {
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
            }
            else {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }

        if (!decodedToken || !decodedToken.userId) {
            logger.error(`User not found. Fake token detected: ${req}`);
            return res.status(403).json({ message: 'Forbidden' });
        }

        if (!mongoose.Types.ObjectId.isValid(decodedToken.userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        req.user = decodedToken.userId
        next();
    });
}

export default authenticateJWT;