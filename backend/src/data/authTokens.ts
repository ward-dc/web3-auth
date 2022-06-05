import { generateMessage, generateToken, getTokenFromMessage } from "../utils/token";
import { ethers } from "ethers";

import prisma from "../utils/prismaHandler";

interface AuthRequest {
	id: string;
	address: string;
	time: Date;
}

let authRequests: AuthRequest[] = [];

export const addToken = (address: string): string => {
	const authToken = generateToken();
	const authRequest: AuthRequest = {
		id: authToken,
		address: address,
		time: new Date(),
	};

	authRequests.push(authRequest);
	return generateMessage(authToken);
};

const getMessageToken = (message: string): AuthRequest | undefined => {
	const authToken = getTokenFromMessage(message);
	return authRequests.find((t) => t.id === authToken);
};

export const cleanTokens = (): void => {
	authRequests = authRequests.filter((authRequest) => {
		const timeDiff = new Date().getTime() - authRequest.time.getTime();
		return timeDiff < 1000 * 60 * 60;
	});
};

export const verifyToken = async (message: string, signature: string) => {
	const signerAddress = ethers.utils.verifyMessage(message,signature);
	const authRequest = getMessageToken(message);
	const authToken = getTokenFromMessage(message);
	

	const validMessage = authRequest?.id === authToken;
	const validSigner = authRequest?.address === signerAddress?.toLocaleLowerCase();
	if (validMessage && validSigner) {
		const sessionToken = generateToken();
		return await prisma.user.upsert({
			where: {
				address: signerAddress,
			},
			create: {
				address: signerAddress,
				sessions: {
					create: {
						id: sessionToken,
					},
				},
			},
			update: {
				sessions: {
					create: {
						id: sessionToken,
					},
				},
			},
		});
	}
	return null;
};
