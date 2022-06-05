import { Request, Response } from "express";
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

	const user = await verifyToken(message, signature);
	if (user) {
		res.send({ success: true, user: user });
		return;
	}

	res.send({ success: false, error: "Invalid signature" });
};
