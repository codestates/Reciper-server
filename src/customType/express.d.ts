export declare global {
	namespace Express {
		interface Request {
			newAccessToken?: string | undefined;
			userId?: number | undefined;
			userEmail?: string | undefined;
		}
	}
}
