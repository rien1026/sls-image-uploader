import { Context } from 'aws-lambda';
import * as parser from 'lambda-multipart-parser';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { AppError } from './utils';

export const imageHandler = async (event: any, context: Context) => {
	try {
		let s3 = new AWS.S3();

		let files = (await parser.parse(event)).files;

		if (!Array.isArray(files) || files.length === 0) {
			return;
		}

		let file = files[0];

		let result = await s3
			.upload({
				Bucket: process.env.BUCKET,
				Body: file.content,
				Key: 'images/' + new Date().getSeconds() + new Date().getMilliseconds() + file.filename,
				ContentType: file.contentType,
				ACL: 'public-read',
			})
			.promise();

		return { statusCode: 200, body: JSON.stringify({ msg: 'suc', data: { link: result.Location } }) };
	} catch (err) {
		new AppError('AppErr', err.message, err.stack);
		return { statusCode: 400, body: JSON.stringify({ msg: err.message }) };
	}
};
