import { VerifyRequest } from "@web3-auth/types/build/Request";
import { ErrorResponse, VerifyResponse } from "@web3-auth/types/build/Response";
import { Request, Response } from "express";
import { verifyToken } from "../../../data/authTokens";
import { Error, StatusCode } from "../../../errors/error";
import cookie from "cookie";

module.exports = async (req: Request, res: Response) => {
	let response: VerifyResponse | ErrorResponse;
	let statusCode: StatusCode = 200;
	try {
		const { message, signature }: VerifyRequest = validateBody(req.body);

		const accountData = await verifyToken(message, signature);
		if (!accountData) {
			throw new Error("Invalid token", 403);
		}

		response = { success: true, result: accountData };
	} catch (err: any) {
		statusCode = err.code || 400;
		response = { success: false, error: err.message };
	}

	res.status(statusCode).send(response);
};

function validateBody(body: VerifyRequest): VerifyRequest {
	const { message, signature } = body;
	if (typeof message !== "string" || typeof signature !== "string") {
		throw new Error("Message and signature required");
	}
	return body;
}
