import { Request, Response, NextFunction } from 'express';

// Simple HTML entity escaping - prevents XSS without external dependencies
const escapeHtml = (str: string): string => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// Sanitize inputs recursively
const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
        return escapeHtml(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map(sanitize);
    }
    if (typeof obj === 'object' && obj !== null) {
        return Object.keys(obj).reduce((acc: any, key) => {
            acc[key] = sanitize(obj[key]);
            return acc;
        }, {});
    }
    return obj;
};

export const sanitizeInputs = (req: Request, res: Response, next: NextFunction) => {
    // Only sanitize req.body - req.query and req.params are read-only in Express 5.x
    if (req.body) {
        req.body = sanitize(req.body);
    }
    next();
};
