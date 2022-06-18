import { AuthState, AuthUser } from "@web3-auth/types/build/Auth";
import { UserResponse } from "@web3-auth/types/build/Response";
import { parseCookies } from "nookies";

export default async function getInitialState(state: AuthState): Promise<AuthState> {
	const userData = await getUserData();
	if (userData) {
		return {
			...state,
			user: userData,
			authorized: true,
		};
	}
	return state;
}

async function getUserData():Promise<AuthUser | null> {
	const isClientSide = typeof window !== "undefined";
	if (isClientSide) {
		try {
			const cookies = parseCookies();
			const token = cookies.token;
			console.log(token);
			if (token) {
				return fetchUserData(token);
			}
		} catch (e) {}
	}
	return null;
}

async function fetchUserData(token: string):Promise<AuthUser | null> {
	const userResponse:UserResponse = await (await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user?token=${token}`)).json();
	console.log(userResponse);
	if (userResponse.success) {
		return userResponse.result;
	}
	return null;
}
