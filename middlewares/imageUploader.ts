import multer from 'multer';
import * as path from 'path';

export const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, 'uploads/');
		},
		filename(req, file, cb) {
			const ext = path.extname(file.originalname);
			req.uploadImageName = path.basename(file.originalname, ext) + Date.now() + ext;
			cb(null, req.uploadImageName);
		},
	}),
	limits: { fileSize: 5 * 1024 * 1024 },
});
