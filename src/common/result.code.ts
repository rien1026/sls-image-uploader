export type Result = {
	errCode?: ErrCode;
	msg?: string;
};

export type ErrCode = CommonErr;

export enum CommonErr {
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	NOT_FOUND = 404,
}
