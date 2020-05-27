import * as Koa from 'koa';
import * as AWS from 'aws-sdk';
import { Constants } from '../../utils/constants';
import { AppError } from '../../common';
import Joi from '@hapi/joi';

const s3 = new AWS.S3();

const PostImageParams = Joi.object({
	imageData: Joi.string().required(),
	imageName: Joi.string().required(),
});

const postImage = async (ctx: Koa.Context) => {
	try {
		let params = await PostImageParams.validateAsync(ctx.request.body);
		console.log(params.name + ':' + params.imageData.length);
		let buffer = Buffer.from(params.imageData, 'base64');
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
