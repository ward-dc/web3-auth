import { ErrHandler, SetUser } from "./Functions";

export interface AuthUser {
	address: string;
	role: string;
	subscription: Date | null;
}

export type LoginFunction = (errHandler: ErrHandler, updateUser?: SetUser) => void;

export interface AuthState {
	user: AuthUser | null;
	authorized: boolean;
	cookiesAccepted: boolean;
	login: LoginFunction;
	logout: () => void;
	acceptCookies: () => void;
}


export type AuthUseState = [AuthState, React.Dispatch<React.SetStateAction<AuthState>>];
