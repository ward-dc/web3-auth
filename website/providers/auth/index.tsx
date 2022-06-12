import { destroyCookie, parseCookies, setCookie } from "nookies";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthState, AuthUser } from "../../types/Auth";
import { ErrHandler } from "../../types/Functions";
import authorizeWallet from "./connect";
import getInitialState from "./init";

const Context = createContext<AuthState>(null as any);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<AuthState>({
		user: null,
		authorized: false,
		cookiesAccepted: true,
		login,
		logout,
		acceptCookies,
	});

	function login(errHandler: ErrHandler) {
		if (!cookiesAccepted()) {
			errHandler("You must accept cookies before logging in.");
			return;
		}

		const setUser = (user: AuthUser) => {
			setState({
				...state,
				user,
				authorized: true,
			});
		};
		authorizeWallet(errHandler, setUser);
	}

	function logout() {
		destroyCookie(null, "token");
		setState({ ...state, user: null, authorized: false });
	}

	function acceptCookies() {
		localStorage.setItem("cookiesAccepted", "true");
		setState({ ...state, cookiesAccepted: true });
	}

	function cookiesAccepted(): boolean {
		return localStorage.getItem("cookiesAccepted") === "true";
	}
	console.log(state);

	useEffect(() => {
		getInitialState(state).then((initialState: AuthState) => {
			setState({ ...initialState, cookiesAccepted: cookiesAccepted() });
		});
	}, []);

	return <Context.Provider value={state}>{children}</Context.Provider>;
}

export function useAuth(): AuthState {
	return useContext(Context);
}

export const AuthConsumer = Context.Consumer;
