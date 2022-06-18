import { AuthInitData, AuthUser } from "./Auth";

interface Response {
	success: true;
}

export type AuthResponse = AuthOkResponse | ErrorResponse;
export interface AuthOkResponse extends Response {
	result: string;
}

export type UserResponse = UserOkResponse | ErrorResponse;
export interface UserOkResponse extends Response {
	result: AuthUser;
}

export type VerifyResponse = VerifyOkResponse | ErrorResponse;
export interface VerifyOkResponse extends Response {
	result: AuthInitData;
}

export type LogoutResponse = LogoutOkResponse | ErrorResponse;
export interface LogoutOkResponse extends Response {
	result: string;
}

export interface ErrorResponse {
    success: false;
	error: string;
}
