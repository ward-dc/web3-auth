import { ErrHandler } from "./Functions";

export type Role = "ADMIN" | "USER";

export interface AuthUser {
	address: string;
	role: Role;
	subscription: Date | null;
}

//30 * 24 * 60 * 60
export type TokenAgeSeconds = 2592000;

export type LoginFunction = (errHandler: ErrHandler) => Promise<void>;

export type LogoutFunction = (errHandler: ErrHandler) => Promise<void>;

export interface AuthState {
	user: AuthUser | null;
	authorized: boolean;
	cookiesAccepted: boolean;
	login: LoginFunction;
	logout: LogoutFunction;
	acceptCookies: () => void;
}

export interface AuthInitData {
	user: AuthUser;
	sessionToken: string;
}

export type AuthUseState = [AuthState, React.Dispatch<React.SetStateAction<AuthState>>];
