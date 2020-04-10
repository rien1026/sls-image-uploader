import serverless from 'serverless-http';
import app from '../app';
import Router from 'koa-router';

import { ImageController } from '../components/image/image.controller';

const router = new Router();
router.post('/images', ImageController.postImage);

app.use(router.routes());
app.use(router.allowedMethods());

export const imageHandler = serverless(app);
