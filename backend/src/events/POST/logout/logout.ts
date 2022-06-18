import { LogoutRequest } from "@web3-auth/types/build/Request";
import { LogoutResponse } from "@web3-auth/types/build/Response";
import { Request, Response } from "express";
import prisma from "../../../utils/prismaHandler";
import { Error } from "../../../errors/error";

module.exports = async (req: Request, res: Response) => {
	let response: LogoutResponse;
	let resposeCode: number = 200;
	try {
		const { token } = validateBody(req.body);
		const deleted = await prisma.session.deleteMany({
			where: {
				id: token,
			},
		});

		if (deleted.count === 0) {
			throw new Error("Invalid token", 403);
		}

		response = { success: true, result: "Successfully logged out." };
	} catch (err: any) {
		resposeCode = err.code || 400;
		response = { success: false, error: err.message };
	}
	res.status(resposeCode).send(response);
};

function validateBody(body: LogoutRequest): LogoutRequest {
	const { token } = body;
	if (typeof token !== "string") {
		throw new Error("Token required.");
	}
	return body;
}
