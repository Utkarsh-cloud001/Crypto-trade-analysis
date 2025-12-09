import { Request, Response, NextFunction } from 'express';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Sanitize inputs recursively
const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
        return DOMPurify.sanitize(obj);
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
    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    next();
};
