import { ethers } from "ethers";

const sendAuthRequest = async (accountAddress: string) => {
	const body = {
		address: accountAddress,
	};
	return await (
		await fetch(`http://localhost:3333/auth`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})
	).json();
};

const sendValidationRequest = async (message: string, signature: string) => {
	const body = {
		message: message,
		signature: signature,
	};
	return await (
		await fetch(`http://localhost:3333/verify`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})
	).json();
};

const login = async (errHandler: (message: string) => void) => {
	const { ethereum } = window as any;
	try {
		if (!ethereum) {
			throw new Error("No ethereum provider");
		}
		const accountAddress = ethereum.selectedAddress;

		const initResponse = await sendAuthRequest(accountAddress);
		const message = initResponse.message;

		await ethereum.send("eth_requestAccounts");

		const provider = new ethers.providers.Web3Provider(ethereum);

		const signer = provider.getSigner();
		const signature = await signer.signMessage(message);

		const signerAddress = await signer.getAddress();

		const validationResponse = await sendValidationRequest(message, signature);

		if (!validationResponse.success) {
			throw new Error(validationResponse.error);
		} else {
			console.log(validationResponse.user);
		}
	} catch (e: any) {
		const message: string = e?.message;
		errHandler(message);
	}
};

export default login;
