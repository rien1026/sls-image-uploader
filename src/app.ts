import Koa from 'koa';
import koabody from 'koa-body';
import cors from '@koa/cors';

import { Constants } from './utils/constants';

const app = new Koa();

// it can be used with router by specific option.
app.use(koabody({ formLimit: '10mb' }));
app.use(cors());

// handle error
app.use(async (ctx: Koa.Context, next: Koa.Next) => {
	try {
		await next();

		// need to explicitly set 404 here
		if (!ctx.status) {
			ctx.status = 400;
			ctx.body = { msg: 'Bad Request.' };
		}
	} catch (err) {
		ctx.status = err.errCode || 500;
		let msg = Constants.PROD_MODE === 'prod' ? 'internal server error.' : err.message;
		ctx.body = { msg: msg };
	}
});

export default app;
