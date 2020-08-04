import * as dotenv from 'dotenv';

const PROD_MODE = (process.env['PROD_MODE'] as any) || 'local';

switch (PROD_MODE) {
	case 'local':
		dotenv.config({ path: './.env' });

		break;
}

const BUCKET = process.env.BUCKET;

export const Constants = { PROD_MODE, BUCKET };
