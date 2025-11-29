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
exports.deleteTag = exports.updateTag = exports.createTag = exports.getTags = void 0;
const Tag_1 = __importDefault(require("../models/Tag"));
const zod_1 = require("zod");
const tagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(50),
    category: zod_1.z.string().min(1).max(50),
    description: zod_1.z.string().max(200).optional(),
});
// Get all tags for the authenticated user
const getTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield Tag_1.default.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tags);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getTags = getTags;
// Create a new tag
const createTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = tagSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }
        const { name, category, description } = validation.data;
        // Check if tag with same name already exists for this user
        const existingTag = yield Tag_1.default.findOne({ user: req.user._id, name });
        if (existingTag) {
            res.status(400).json({ message: 'Tag with this name already exists' });
            return;
        }
        const tag = yield Tag_1.default.create({
            name,
            category,
            description,
            user: req.user._id,
        });
        res.status(201).json(tag);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createTag = createTag;
// Update a tag
const updateTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = tagSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }
        const tag = yield Tag_1.default.findOne({ _id: req.params.id, user: req.user._id });
        if (!tag) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }
        tag.name = req.body.name || tag.name;
        tag.category = req.body.category || tag.category;
        tag.description = req.body.description !== undefined ? req.body.description : tag.description;
        const updatedTag = yield tag.save();
        res.json(updatedTag);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateTag = updateTag;
// Delete a tag
const deleteTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tag = yield Tag_1.default.findOne({ _id: req.params.id, user: req.user._id });
        if (!tag) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }
        yield tag.deleteOne();
        res.json({ message: 'Tag deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteTag = deleteTag;
