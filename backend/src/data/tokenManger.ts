import { ethers } from "ethers";
import { AuthRequestData } from "../types/Auth";
import { generateMessage, generateToken, getTokenFromMessage } from "../utils/token";
import prisma from "../utils/prismaHandler";
import { AuthInitData, AuthUser } from "@web3-auth/types/build/Auth";

class TokenManger {
	tokens: AuthRequestData[];
	constructor() {
		this.tokens = [];
	}

	public addToken(address: string): string {
		const authToken = generateToken();
		const authRequest: AuthRequestData = {
			id: authToken,
			address: address,
			time: new Date(),
		};

		this.tokens.push(authRequest);
		return generateMessage(authToken);
	}

	public async verifySignature(message: string, signature: string): Promise<AuthInitData | null> {
		const signerAddress = ethers.utils.verifyMessage(message, signature);

		if (this.isValidSignature(message, signerAddress)) {
			const sessionToken = generateToken();

			const user = await this.upsertUser(signerAddress, sessionToken);
			return {
				user: user,
				sessionToken: sessionToken,
			};
		}
		return null;
	}

	private async upsertUser(signerAddress: string, sessionToken: string): Promise<AuthUser> {
		signerAddress = signerAddress.toLocaleLowerCase();
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
			select: {
				address: true,
				role: true,
				subscription: true,
			},
		});
	}

	private getAuthRequest(token: string): AuthRequestData | undefined {
		return this.tokens.find((t) => t.id === token);
	}

	private isValidSignature(message: string, signerAddress: string): boolean {
		const authToken = getTokenFromMessage(message);
		const authRequest: AuthRequestData | undefined = this.getAuthRequest(authToken);

		const validMessage = authRequest?.id === authToken;
		const validSigner = authRequest?.address === signerAddress?.toLocaleLowerCase();
		return validMessage && validSigner;
	}
}

export default TokenManger;
