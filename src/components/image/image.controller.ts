import * as Koa from 'koa';
import * as AWS from 'aws-sdk';
import { Constants } from '../../utils/constants';
import { AppError } from '../../common';
import Joi from '@hapi/joi';

const postImage = async (ctx: Koa.Context) => {
	try {
		let s3 = new AWS.S3();

		let PostImageParams = Joi.object({
			imageData: Joi.string().required(),
			imageName: Joi.string().required(),
		});

		let params = await PostImageParams.validateAsync(ctx.request.body);

		let buffer = Buffer.from(params.imageData, 'base64');
		let fileSize = buffer.byteLength;
		console.log('[image!!] = ' + params.imageName + ':' + fileSize + '=== file buffer size');

		await s3
			.putObject({
				Bucket: Constants.BUCKET,
				Body: buffer,
				Key: params.imageName,
				ContentType: 'image',
				ACL: 'public-read',
			})
			.promise();
	} catch (err) {
		throw new AppError('postImage', err.message, err.stack);
	}

	ctx.status = 200;
	ctx.body = { msg: 'suc' };
};

export const ImageController = { postImage };
