import { Request, Response } from "express";
import { setCookie } from "nookies";
import { addToken, verifyToken } from "../../data/authTokens";
import prisma from "../../utils/prismaHandler";
module.exports = async (req: Request, res: Response) => {
	const { message, signature } = req.body;

	if (
		!message ||
		typeof message !== "string" ||
		!signature ||
		typeof signature !== "string"
	) {
		console.log(message, signature);
		res.status(400).send({ success: false, error: "Address required" });
		return;
	}

	const accountData = await verifyToken(message, signature);
	if (accountData) {
		setCookie({ res }, 'token', accountData.sessionToken, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          });
		res.send({ success: true, result: accountData });
		return;
	}

	res.send({ success: false, error: "Invalid signature" });
};
