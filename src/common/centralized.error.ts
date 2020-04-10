import { ErrCode } from './result.code';

export class AppError extends Error {
	errCode?: ErrCode;

	constructor(name: string, message: string, stack: string, errCode?: ErrCode) {
		super();
		this.name = name;
		this.message = message;
		this.stack = stack;
		this.errCode = errCode;

		this.doAfterErr();
	}

	doAfterErr = () => {
		console.error({ e: this.name + ': ' + this.message, message: ' ', errCode: this.errCode });
	};
}
