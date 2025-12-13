/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from '../models/User';
import mongoose from 'mongoose';

declare global {
    namespace Express {
        interface User extends Omit<IUser, '_id'> {
            _id: string;
        }

        interface Request {
            user?: User;
        }
    }
}
