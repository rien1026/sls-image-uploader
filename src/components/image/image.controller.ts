import * as Koa from 'koa';
import * as AWS from 'aws-sdk';
import { Constants } from '../../utils/constants';
import { AppError } from '../../common';

const s3 = new AWS.S3();

const postImage = async (ctx: Koa.Context) => {
	let imageData = ctx.request.body.imageData;
	let imageName = ctx.request.body.imageName;

	try {
		let buffer = Buffer.from(imageData, 'base64');
		let result = await s3
			.putObject({
				Bucket: Constants.BUCKET,
				Body: buffer,
				Key: imageName,
				ContentType: 'image/png',
				ACL: 'public-read',
			})
			.promise();

		console.log('result', result);
	} catch (err) {
		throw new AppError('postImage', err.message, err.stack);
	}

	ctx.status = 200;
	ctx.body = { msg: 'suc' };
};

export const ImageController = { postImage };
