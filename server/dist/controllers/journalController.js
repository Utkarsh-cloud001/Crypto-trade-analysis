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
exports.deleteJournal = exports.updateJournal = exports.getJournalById = exports.getJournalEntries = exports.createJournal = void 0;
const Journal_1 = __importDefault(require("../models/Journal"));
const zod_1 = require("zod");
const journalSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    linkedTrade: zod_1.z.string().optional(),
    mood: zod_1.z.enum(['EXCELLENT', 'GOOD', 'NEUTRAL', 'BAD', 'TERRIBLE']).optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
});
// @desc    Create journal entry
// @route   POST /api/journal
// @access  Private
const createJournal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = journalSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }
        const { title, content, tags, linkedTrade, mood, images } = validation.data;
        const journal = yield Journal_1.default.create({
            user: req.user._id,
            title,
            content,
            tags,
            linkedTrade,
            mood,
            images,
        });
        res.status(201).json(journal);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createJournal = createJournal;
// @desc    Get all journal entries for user
// @route   GET /api/journal
// @access  Private
const getJournalEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entries = yield Journal_1.default.find({ user: req.user._id })
            .populate('linkedTrade')
            .sort({ date: -1 });
        res.json(entries);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getJournalEntries = getJournalEntries;
// @desc    Get single journal entry
// @route   GET /api/journal/:id
// @access  Private
const getJournalById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entry = yield Journal_1.default.findById(req.params.id).populate('linkedTrade');
        if (!entry) {
            res.status(404).json({ message: 'Journal entry not found' });
            return;
        }
        if (entry.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        res.json(entry);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getJournalById = getJournalById;
// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
const updateJournal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entry = yield Journal_1.default.findById(req.params.id);
        if (!entry) {
            res.status(404).json({ message: 'Journal entry not found' });
            return;
        }
        if (entry.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        const updatedEntry = yield Journal_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updatedEntry);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateJournal = updateJournal;
// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
const deleteJournal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entry = yield Journal_1.default.findById(req.params.id);
        if (!entry) {
            res.status(404).json({ message: 'Journal entry not found' });
            return;
        }
        if (entry.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        yield Journal_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Journal entry deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteJournal = deleteJournal;
