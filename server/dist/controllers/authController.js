"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAccount = exports.deleteAllJournals = exports.updateUserProfile = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Journal_1 = __importDefault(require("../models/Journal"));
const Trade_1 = __importDefault(require("../models/Trade"));
const Tag_1 = __importDefault(require("../models/Tag"));
const validation_1 = require("../utils/validation");
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = validation_1.registerSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }
        const { name, email, password } = validation.data;
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Password hashing is handled in User model pre-save hook
        // We pass 'password' to passwordHash field, the hook will hash it
        // Wait, the hook hashes 'passwordHash'. So we should assign password to passwordHash initially?
        // Actually, standard practice is to pass plain password and let hook hash it.
        // But my model has 'passwordHash'. Let's adjust the model usage.
        // Correction: The model expects 'passwordHash'. 
        // If I pass plain password to 'passwordHash', the hook will hash it.
        const user = yield User_1.default.create({
            name,
            email,
            passwordHash: password,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                settings: user.settings,
                token: generateToken(user._id.toString()),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = validation_1.loginSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }
        const { email, password } = validation.data;
        const user = yield User_1.default.findOne({ email });
        if (user && (yield user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                settings: user.settings,
                token: generateToken(user._id.toString()),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.loginUser = loginUser;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.passwordHash = req.body.password;
            }
            if (req.body.settings) {
                user.settings = Object.assign(Object.assign({}, user.settings), req.body.settings);
            }
            const updatedUser = yield user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                settings: updatedUser.settings,
                token: generateToken(updatedUser._id.toString()),
            });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateUserProfile = updateUserProfile;
// Delete all journal entries for the user
const deleteAllJournals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Journal_1.default.deleteMany({ user: req.user._id });
        res.json({ message: `Deleted ${result.deletedCount} journal entries` });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteAllJournals = deleteAllJournals;
// Delete user account and all associated data
const deleteUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        // Delete all user data
        yield Promise.all([
            Journal_1.default.deleteMany({ user: userId }),
            Trade_1.default.deleteMany({ user: userId }),
            Tag_1.default.deleteMany({ user: userId }),
            User_1.default.findByIdAndDelete(userId),
        ]);
        res.json({ message: 'Account and all data deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteUserAccount = deleteUserAccount;
