import { ErrHandler } from "@web3-auth/types/build/Functions";
import { LogoutResponse } from "../../../types/src/Response";
import { LogoutRequest } from "../../../types/src/Request";
import { parseCookies } from "nookies";

export default async function sendServerLogout(errHandler: ErrHandler): Promise<boolean> {
	try {
		const cookies = parseCookies();
		const logoutResponse: LogoutResponse = await sendLogoutRequest(cookies.token);
		console.log("response", logoutResponse);
		if (!logoutResponse.success) {
			throw new Error(logoutResponse.error);
		}
		return true;
	} catch (e: any) {
		errHandler(e.message);
		return false;
	}
}

async function sendLogoutRequest(token: string): Promise<LogoutResponse> {
	console.log("t",token);
	return await (
		await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, {
			method: "POST",
			body: JSON.stringify({ token }),
			headers: { "Content-Type": "application/json" },
		})
	).json();
}
