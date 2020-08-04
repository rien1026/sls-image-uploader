import Koa from 'koa';
import koabody from 'koa-body';
import cors from '@koa/cors';
import Router from 'koa-router';
import serverless from 'serverless-http';
import { Constants } from './utils/Constants';
import { ImageController } from './components/image/image.controller';
import { HTTP_RES_NOT_FOUND, HTTP_RES_NOT_FOUND_MSG, HTTP_RES_BAD_REQUEST, HTTP_RES_BAD_REQUEST_MSG } from './utils';

const app = new Koa();
const router = new Router();

// it can be used with router by specific option.
app.use(koabody({ formLimit: '10mb', multipart: true }));
app.use(cors());

// handle error
app.use(async (ctx: Koa.Context, next: Koa.Next) => {
	try {
		console.log(ctx.request.method + '---' + ctx.request.url);
		await next();

		if (!ctx.status) {
			ctx.status = HTTP_RES_BAD_REQUEST;
			ctx.body = { msg: HTTP_RES_BAD_REQUEST_MSG };
		}
	} catch (err) {
		ctx.status = err.response ? err.response : HTTP_RES_NOT_FOUND;
		let msg = Constants.PROD_MODE === 'prod' ? HTTP_RES_NOT_FOUND_MSG : err.message;
		ctx.body = { msg: msg, errCode: err.errCode };
	}
});
router.post('/images', ImageController.postImage);

app.use(router.routes());
app.use(router.allowedMethods());

if (Constants.PROD_MODE === 'local') {
	app.listen(3000, () => {
		console.log({ i: '[SERVER] is listening.', mode: Constants.PROD_MODE, port: 3000 });
	});
}

export const imageHandler = serverless(app);
