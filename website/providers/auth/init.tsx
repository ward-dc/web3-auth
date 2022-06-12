import { parseCookies } from "nookies";
import { AuthState } from "../../types/Auth";

export default async function getInitialState(state: AuthState): Promise<AuthState> {
	const userData = await getUserData();
	if (userData) {
		console.log({
			...state,
			user: userData,
			authorized: true,
		});
		return {
			...state,
			user: userData,
			authorized: true,
		};
	}
	return state;
}

async function getUserData() {
	const isClientSide = typeof window !== "undefined";
	if (isClientSide) {
		try {
			const cookies = parseCookies();
			const token = cookies.token;

			if (token) {
				return fetchUserData(token);
			}
		} catch (e) {}
	}
	return null;
}

async function fetchUserData(token: string) {
	const userResponse = await (await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user?token=${token}`)).json();
	if (userResponse.success) {
		return userResponse.result;
	}
	return null;
}
