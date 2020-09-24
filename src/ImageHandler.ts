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
		if (file.content.length > 5000000) {
			return { statusCode: 400, body: JSON.stringify({ msg: 'The file size is too big.' }) };
		}

		let fileType = file.contentType;
		if (fileType.includes('jpg') || fileType.includes('jpeg') || fileType.includes('png')) {
			return { statusCode: 400, body: JSON.stringify({ msg: 'The file format must be jpg, jpeg, png.' }) };
		}

		let file360;
		let file640;
		let file1280;
		let metadata = await sharp(file.content).metadata();
		file360 = await sharp(file.content).resize({ width: 426 }).toBuffer();
		file640 = file.content;
		file1280 = file.content;
		if (metadata.width > 640) {
			file640 = await sharp(file.content).resize({ width: 640 }).toBuffer();
		}
		if (metadata.width > 1280) {
			file1280 = await sharp(file.content).resize({ width: 1280 }).toBuffer();
		}
		let ts = new Date().getSeconds() + new Date().getMilliseconds();

		await s3
			.upload({
				Bucket: process.env.BUCKET,
				Body: file.content,
				Key: 'images/origin/' + ts + file.filename,
				ACL: 'public-read',
				ContentType: fileType,
			})
			.promise();

		if (file360 && file640 && file1280) {
			await s3
				.upload({
					Bucket: process.env.BUCKET,
					Body: file360,
					Key: 'images/240/' + ts + file.filename,
					ACL: 'public-read',
					ContentType: fileType,
				})
				.promise();
			await s3
				.upload({
					Bucket: process.env.BUCKET,
					Body: file640,
					Key: 'images/640/' + ts + file.filename,
					ACL: 'public-read',
					ContentType: fileType,
				})
				.promise();
			await s3
				.upload({
					Bucket: process.env.BUCKET,
					Body: file1280,
					Key: 'images/1280/' + ts + file.filename,
					ACL: 'public-read',
					ContentType: fileType,
				})
				.promise();
		}

		return {
			headers: {
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'OPTIONS,POST',
			},
			statusCode: 200,
			body: JSON.stringify({ msg: 'OK', data: { link: 'http://image.amipure.com/origin/' + ts + file.filename } }),
		};
	} catch (err) {
		new AppError('AppErr', err.message, err.stack);
		return { statusCode: 400, body: JSON.stringify({ msg: err.message }) };
	}
};
