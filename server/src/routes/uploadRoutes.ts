import express from 'express';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

export default router;
