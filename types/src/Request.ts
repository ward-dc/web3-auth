export interface AuthRequest {
	address: string;
}

export interface UserRequest {
	token: string;
}

export interface VerifyRequest {
	message: string;
	signature: string;
}


export interface LogoutRequest {
	address: string;
	token: string;
}