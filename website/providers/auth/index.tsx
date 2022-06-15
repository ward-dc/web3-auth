import { destroyCookie, parseCookies, setCookie } from "nookies";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ErrHandler } from "../../../types/src/Functions";
import authorizeWallet from "./connect";
import getInitialState from "./init";
import { AuthInitData, AuthState, TokenAgeSeconds } from "@web3-auth/types/build/Auth";

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

	async function login(errHandler: ErrHandler) {
		try {
			if (!cookiesAccepted()) {
				throw new Error("You must accept cookies before logging in.");
			}

			const userInitData: AuthInitData | null = await authorizeWallet(errHandler);
			if (!userInitData) {
				return;
			}

			const tokenAge: TokenAgeSeconds = 2592000;
			setCookie(null, "token", userInitData.sessionToken, {
				maxAge: tokenAge,
			});
			setState({
				...state,
				user: userInitData.user,
				authorized: true,
			});
		} catch (err: any) {
			errHandler(err.message);
		}
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
