import { ExternalProvider } from "@ethersproject/providers/lib/web3-provider";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Maybe } from "@metamask/providers/dist/utils";
import { ethers } from "ethers";
import { setCookie } from "nookies";
import { ErrHandler, SetUser } from "../../../types/src/Functions";
import { AuthResponse, ErrorResponse, VerifyResponse } from "../../../types/src/Response";
import { AuthInitData, AuthUser } from "@web3-auth/types/build/Auth";

export default async function authorizeWallet(errHandler: ErrHandler): Promise<AuthInitData | null> {
	try {
		const ethereum:MetaMaskInpageProvider = await getEthereum();
		const accountAddress:string = await getAccountAddress(ethereum);

		const initResponse:AuthResponse = await sendAuthRequest(accountAddress);

		const message:string = getMessage(initResponse);
		const signature: string = await requestUserSignature(ethereum as any, message);

		const validationResponse:VerifyResponse = await sendValidationRequest(message, signature);

		return getUserResult(validationResponse);
	} catch (e) {
		errHandler(getErrorMessage(e));
		return null;
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

function getUserResult(validationResponse: VerifyResponse):AuthInitData {
	if (!validationResponse.success) {
		throw new Error(validationResponse.error);
	}
	return validationResponse.result;
}

function getMessage(initResponse: AuthResponse) {
	if (!initResponse.success) {
		throw new Error(initResponse.error);
	}
	return initResponse.result;
}

