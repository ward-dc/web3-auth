import { ExternalProvider } from "@ethersproject/providers/lib/web3-provider";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Maybe } from "@metamask/providers/dist/utils";
import { ethers } from "ethers";
import { setCookie } from "nookies";
import { AuthUser } from "../../types/Auth";
import { ErrHandler, SetUser } from "../../types/Functions";
import { AuthResponse, VerifyResponse } from "../../types/Response";

export default async function authorizeWallet(errHandler: ErrHandler, setUser: SetUser): Promise<void> {
	try {
		const ethereum = await getEthereum();
		const accountAddress = await getAccountAddress(ethereum);

		const initResponse = await sendAuthRequest(accountAddress);
		const message = initResponse.result;
		const signature: string = await requestUserSignature(ethereum as any, message);

		const validationResponse = await sendValidationRequest(message, signature);

		syncUserInfo(setUser, validationResponse);
	} catch (e) {
		errHandler(getErrorMessage(e));
	}
}

function getErrorMessage(error: unknown) {
	const e = error as Error;
	return e.message;
}

async function sendAuthRequest(accountAddress: string): Promise<AuthResponse> {
	const body = {
		address: accountAddress,
	};
	return await (
		await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})
	).json();
}

async function sendValidationRequest(message: string, signature: string): Promise<VerifyResponse> {
	const body = {
		message: message,
		signature: signature,
	};
	return await (
		await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})
	).json();
}

async function getEthereum(): Promise<MetaMaskInpageProvider> {
	if (typeof window !== "undefined") {
		const ethereum = window.ethereum;
		if (ethereum) {
			if (!ethereum) {
				throw new Error("No Ethereum browser detected");
			}
			return ethereum;
		}
	}
	throw new Error("No Ethereum browser detected");
}

async function getAccountAddress(ethereum: MetaMaskInpageProvider): Promise<string> {
	const accounts: Maybe<string[]> = await ethereum.request?.({
		method: "eth_requestAccounts",
	});
	if (!accounts) {
		throw new Error("No accounts detected");
	}
	const firstAccount = accounts.shift();
	if (!firstAccount) {
		throw new Error("No accounts detected");
	}
	return firstAccount;
}

async function requestUserSignature(ethereum: ExternalProvider, message: string): Promise<string> {
	const provider = new ethers.providers.Web3Provider(ethereum);

	const signer = provider.getSigner();
	return await signer.signMessage(message);
}

function syncUserInfo(setUser: (user: AuthUser) => void, validationResponse: VerifyResponse) {
	if (!validationResponse.success) {
		throw new Error(validationResponse.error);
	} else {
		setUser(validationResponse.result.user);
		setCookie(null, "token", validationResponse.result.sessionToken, {
			maxAge: 30 * 24 * 60 * 60,
			path: "/",
		});
	}
}
