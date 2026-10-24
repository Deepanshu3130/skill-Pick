const { verifyToken } = require('@clerk/clerk-sdk-node');
require('dotenv').config();

/**
 * Express middleware that strictly validates Clerk JWT from the Authorization header.
 * Attaches verified userId to req.userId.
 * Never trusts any userId in the request body.
 */
async function requireUserAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: "unauthorized",
                message: "Please log in to add a course."
            });
        }

        const token = authHeader.split(' ')[1]?.trim();
        if (!token) {
            return res.status(401).json({
                status: "unauthorized",
                message: "Please log in to add a course."
            });
        }

        // Allow test tokens during automated test runs
        if (process.env.NODE_ENV === 'test' && token.startsWith('test_token_')) {
            const mockUserId = token.replace('test_token_', '');
            req.userId = mockUserId;
            req.auth = { userId: mockUserId };
            return next();
        }

        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
            jwtKey: process.env.CLERK_JWT_KEY
        });

        if (!payload || !payload.sub) {
            return res.status(401).json({
                status: "unauthorized",
                message: "Invalid authentication token."
            });
        }

        req.userId = payload.sub;
        req.auth = { userId: payload.sub };
        next();
    } catch (err) {
        console.warn("Auth verification failed:", err.message);
        return res.status(401).json({
            status: "unauthorized",
            message: "Please log in to add a course."
        });
    }
}

/**
 * Optional user auth: populates req.userId if a valid token is present, but doesn't block if missing.
 */
async function optionalUserAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1]?.trim();
            if (token) {
                if (process.env.NODE_ENV === 'test' && token.startsWith('test_token_')) {
                    const mockUserId = token.replace('test_token_', '');
                    req.userId = mockUserId;
                    req.auth = { userId: mockUserId };
                    return next();
                }

                const payload = await verifyToken(token, {
                    secretKey: process.env.CLERK_SECRET_KEY,
                    jwtKey: process.env.CLERK_JWT_KEY
                });
                if (payload?.sub) {
                    req.userId = payload.sub;
                    req.auth = { userId: payload.sub };
                }
            }
        }
    } catch {
        // Ignore errors in optional auth
    }
    next();
}

module.exports = {
    requireUserAuth,
    optionalUserAuth
};
