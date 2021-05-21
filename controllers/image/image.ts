import { Request, Response } from 'express';

const postImage = (req: Request, res: Response) => {
	console.log('🤍postImage- ', req.uploadImageName);
	const imageUrl = req.uploadImageName;
	if (imageUrl) {
		res.status(200).json({
			uploadImage: imageUrl,
		});
	} else {
		res.status(400).json({
			message: 'image not imported',
		});
	}
};

export default postImage;
