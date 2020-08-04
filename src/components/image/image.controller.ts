import * as Koa from 'koa';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { Constants } from '../../utils/Constants';
import { AppError } from '../../utils';

const postImage = async (ctx: Koa.Context) => {
	try {
		let s3 = new AWS.S3();

		let image = ctx.request.files.image;

		let file = fs.readFileSync(image.path);

		let result = await s3
			.upload({
				Bucket: Constants.BUCKET,
				Body: file,
				Key: 'images/' + new Date().getSeconds() + new Date().getMilliseconds() + image.name,
				ContentType: image.type,
				ACL: 'public-read',
			})
			.promise();

		ctx.status = 200;
		ctx.body = { msg: 'suc', data: { link: result.Location } };
	} catch (err) {
		throw new AppError('postImage', err.message, err.stack);
	}
};

export const ImageController = { postImage };
