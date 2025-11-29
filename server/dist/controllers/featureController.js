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
exports.unvoteFeature = exports.voteFeature = exports.createFeature = exports.getFeatures = void 0;
const Feature_1 = __importDefault(require("../models/Feature"));
const zod_1 = require("zod");
const featureSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().min(1).max(500),
    category: zod_1.z.enum(['feature', 'announcement']).optional(),
});
// Get all features (sorted by votes)
const getFeatures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        const features = yield Feature_1.default.find(filter)
            .sort({ votes: -1, createdAt: -1 })
            .populate('createdBy', 'name email');
        res.json(features);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getFeatures = getFeatures;
// Create a new feature request
const createFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = featureSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.issues });
            return;
        }
        const { title, description, category } = validation.data;
        const feature = yield Feature_1.default.create({
            title,
            description,
            category: category || 'feature',
            createdBy: req.user._id,
        });
        res.status(201).json(feature);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createFeature = createFeature;
// Vote for a feature
const voteFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feature = yield Feature_1.default.findById(req.params.id);
        if (!feature) {
            res.status(404).json({ message: 'Feature not found' });
            return;
        }
        const userId = req.user._id.toString();
        const hasVoted = feature.voters.some(voter => voter.toString() === userId);
        if (hasVoted) {
            res.status(400).json({ message: 'Already voted for this feature' });
            return;
        }
        feature.voters.push(req.user._id);
        feature.votes += 1;
        yield feature.save();
        res.json(feature);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.voteFeature = voteFeature;
// Remove vote from a feature
const unvoteFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feature = yield Feature_1.default.findById(req.params.id);
        if (!feature) {
            res.status(404).json({ message: 'Feature not found' });
            return;
        }
        const userId = req.user._id.toString();
        const voterIndex = feature.voters.findIndex(voter => voter.toString() === userId);
        if (voterIndex === -1) {
            res.status(400).json({ message: 'Have not voted for this feature' });
            return;
        }
        feature.voters.splice(voterIndex, 1);
        feature.votes -= 1;
        yield feature.save();
        res.json(feature);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.unvoteFeature = unvoteFeature;
