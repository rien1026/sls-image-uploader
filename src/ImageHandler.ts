import { Context } from 'aws-lambda';
import * as parser from 'lambda-multipart-parser';
import * as AWS from 'aws-sdk';
import sharp from 'sharp';
import { AppError } from './utils';

export const imageHandler = async (event: any, context: Context) => {
	try {
		let s3 = new AWS.S3();

		let files = (await parser.parse(event)).files;

		if (!Array.isArray(files) || files.length === 0) {
			return { statusCode: 400, body: JSON.stringify({ msg: 'There is no file.' }) };
		}

		let file = files[0];
		if (file.content.length > 3000000) {
			return { statusCode: 400, body: JSON.stringify({ msg: 'The file size is too big.' }) };
		}

		let fileType = file.contentType;

		let file360;
		let file720;
		if (fileType.includes('jpg') || fileType.includes('jpeg') || fileType.includes('png')) {
			file360 = await sharp(file.content).resize({ width: 360 }).toBuffer();
			file720 = await sharp(file.content).resize({ width: 720 }).toBuffer();
		}

		let ts = new Date().getSeconds() + new Date().getMilliseconds();

		let result = await s3
			.upload({
				Bucket: process.env.BUCKET,
				Body: file.content,
				Key: 'images/origin/' + ts + file.filename,
				ACL: 'public-read',
				ContentType: fileType,
			})
			.promise();

		if (file360 && file720) {
			await s3
				.upload({
					Bucket: process.env.BUCKET,
					Body: file360,
					Key: 'images/360/' + ts + file.filename,
					ACL: 'public-read',
					ContentType: fileType,
				})
				.promise();
			await s3
				.upload({
					Bucket: process.env.BUCKET,
					Body: file720,
					Key: 'images/720/' + ts + file.filename,
					ACL: 'public-read',
					ContentType: fileType,
				})
				.promise();
		}

		return { statusCode: 200, body: JSON.stringify({ msg: 'OK', data: { link: result.Location } }) };
	} catch (err) {
		new AppError('AppErr', err.message, err.stack);
		return { statusCode: 400, body: JSON.stringify({ msg: err.message }) };
	}
};
