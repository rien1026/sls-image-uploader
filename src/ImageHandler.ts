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
		if (!fileType.includes('jpg') && !fileType.includes('jpeg') && !fileType.includes('png') && !fileType.includes('gif')&& !fileType.includes('mp4')) {
			return { statusCode: 400, body: JSON.stringify({ msg: 'The file format must be jpg, jpeg, png, gif, mp4.' }) };
		}

		let ts = ''+new Date().getSeconds() + new Date().getMilliseconds();

	 /*let file426;
		let file720;
		let file1280;
		let metadata = await sharp(file.content).metadata();
		file426 = file.content;
		file720 = file.content;
		file1280 = file.content;

		if(!fileType.includes('gif')){
			file426 = await sharp(file.content).resize({ width: 426 }).toBuffer();
		} else if (!fileType.includes('gif') && metadata.width > 720) {
			file720 = await sharp(file.content).resize({ width: 720 }).toBuffer();
		} else if (!fileType.includes('gif') && metadata.width > 1280) {
			file1280 = await sharp(file.content).resize({ width: 1280 }).toBuffer();
		} */

		let res = await s3
			.upload({
				Bucket: process.env.BUCKET,
				Body: file.content,
				Key: 'images/origin/' + ts,
				ACL: 'public-read',
				ContentType: fileType,
			})
			.promise();

		return {
			headers: {
				'Access-Control-Allow-Headers': '*',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'OPTIONS,POST',
			},
			statusCode: 200,
			body: JSON.stringify({ msg: 'OK', data: { link: res.Location } }),
		};
	} catch (err) {
		new AppError('AppErr', err.message, err.stack);
		return { statusCode: 400, body: JSON.stringify({ msg: err.message }) };
	}
};
