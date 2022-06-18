import { AuthResponse, ErrorResponse } from "@web3-auth/types/build/Response";
import { AuthRequest } from "@web3-auth/types/build/Request";
import { Request, Response } from "express";
import { createMessage } from "../../../data/authTokens";
import prisma from "../../../utils/prismaHandler";
import moment from "moment";
import { UserByAddress } from "../../../types/Auth";
import { Error, StatusCode } from "../../../errors/error";

module.exports = async (req: Request, res: Response) => {
	let response: AuthResponse | ErrorResponse;
	let statusCode: StatusCode = 200;
	try {
		const { address }: AuthRequest = validateBody(req.body);

		const user: UserByAddress | null = await getUserByAddress(address);
		if (user) {
			checkUserBanned(user);
		}

		const message = createMessage(address);
		response = { success: true, result: message };
	} catch (err: any) {
		statusCode = err.code || 400;
		response = { success: false, error: err.message };
	}

	res.status(statusCode).send(response);
};

function validateBody(body: AuthRequest): AuthRequest {
	const { address } = body;
	if (typeof address !== "string") {
		throw new Error("Address required");
	}
	return body;
}

function getUserByAddress(address: string): Promise<UserByAddress | null> {
	return prisma.user.findFirst({
		where: {
			address: address,
		},
		select: {
			bans: {
				where: {
					until: {
						gt: new Date(),
					},
				},
			},
		},
	});
}

function checkUserBanned(user: UserByAddress) {
	if (user.bans.length > 0) {
		const ban = user.bans[0];
		const until = moment(ban.until);
		const now = moment();
		const duration = moment.duration(now.diff(until));
		let reason = "";
		if (ban.reason) {
			reason = `Reason: ${ban.reason}`;
		}
		throw new Error(`You are banned for ${duration.humanize()}. ${reason}`, 401);
	}
}
