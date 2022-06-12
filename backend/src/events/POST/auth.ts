import { Request, Response } from "express";
import { addToken } from "../../data/authTokens";
import prisma from "../../utils/prismaHandler";
module.exports = async (req: Request, res: Response) => {

	const { address } = req.body;

	if (!address || typeof address !== "string") {
		res.status(400).send({ success: false, error: "Address required" });
		return;
	}

	const message = addToken(address);

	res.send({ success: true, result: message });
};
