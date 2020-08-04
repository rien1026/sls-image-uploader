export const logger = {
	info: async (info: {}) => {
		console.log(info);

		// invoke log module like winston.
	},
	error: async (error: {}) => {
		console.log(error);

		// invoke log module like winston.
	},
};
