import { header, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';


// Middleware to validate the token
export const validateToken = [
    header('authorization')
        .exists().withMessage('Authorization header is required')
        .isString().withMessage('Authorization must be a string')
        .matches(/^Bearer\s+\S+/).withMessage('Invalid token format'),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 'error', 
            errors: errors.array().map(error => ({ msg: error.msg, param: error.param }))
        });
    }
    next();
};

// Middleware to authenticate the token
export const authenticate = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ err: 'Token has expired' });
            }
            return res.status(401).json({ err: 'Unauthorized' });
        }
        req.userId = decoded.userId; // Attach user ID to the request
        next(); // Proceed to the next middleware or route handler
    });
};


export const tokenMiddleware = [
    validateToken,
    handleValidationErrors,
    authenticate,
];