import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination(req: any, file: any, cb: any) {
        cb(null, 'uploads/');
    },
    filename(req: any, file: any, cb: any) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file: any, cb: any) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
}

export const upload = multer({
    storage,
    fileFilter: function (req: any, file: any, cb: any) {
        checkFileType(file, cb);
    },
});
