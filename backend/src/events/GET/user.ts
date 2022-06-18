import { Request, Response } from "express";
import { ErrorResponse, UserResponse } from "@web3-auth/types/build/Response";
import prisma from "../../utils/prismaHandler";
import { TokenAgeSeconds } from "@web3-auth/types/build/Auth";
import { Error, StatusCode } from "../../errors/error";

module.exports = async (req: Request, res: Response) => {
	let response: UserResponse | ErrorResponse;
	let statusCode: StatusCode = 200;
	try {
		const { token }: any = req.query;

		const user = await getValidUser(token);

		response = { success: true, result: user };
	} catch (err: any) {
		response = { success: false, error: err.message };
	}
	res.status(statusCode).send(response);
};

async function getValidUser(token: string) {
	const user = await getUserByToken(token);

	updateTokenLastLogin(token);

	if (user) {
		return user;
	}
	throw new Error("Invalid token");
}

async function updateTokenLastLogin(token: string) {
	const tokenAgeInSeconds: TokenAgeSeconds = 2592000;
	await prisma.session.updateMany({
		where: {
			id: token,
			lastLogin: {
				lt: new Date(Date.now() - tokenAgeInSeconds * 1000),
			},
		},
		data: {
			lastLogin: new Date(),
		},
	});
}

async function getUserByToken(token: string) {
	const tokenAgeInSeconds: TokenAgeSeconds = 2592000;
	return await prisma.user.findFirst({
		where: {
			sessions: {
				some: {
					id: token,
					lastLogin: {
						gt: new Date(Date.now() - tokenAgeInSeconds * 1000),
					},
				},
			},
		},
	});
}
