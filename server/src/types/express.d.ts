import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
                email: string;
                name: string;
                role: string;
            };
        }
    }
}

export { };
