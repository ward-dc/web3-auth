import {
	generateMessage,
	generateToken,
	getTokenFromMessage,
} from "../utils/token";
import { ethers } from "ethers";

import prisma from "../utils/prismaHandler";
import { AuthRequestData } from "../types/Auth";
import TokenManger from "./tokenManger";
import { AuthInitData, AuthUser } from "@web3-auth/types/build/Auth";

let tokenManger = new TokenManger();

export const createMessage = (address: string): string => {
	return tokenManger.addToken(address);
};

export const cleanTokens = (): void => {
	tokenManger = new TokenManger();
};

export const verifyToken = async (message: string, signature: string):Promise<AuthInitData | null> => {
	return await tokenManger.verifySignature(message, signature);
};
