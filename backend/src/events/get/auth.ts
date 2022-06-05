import { Request, Response } from "express";
import { addToken } from "../../data/authTokens";
import prisma from "../../utils/prismaHandler";
module.exports = async (req: Request, res: Response) => {
	const { address } = req.query;

	if (!address || typeof address !== "string") {
		res.status(400).send({ error: "Address required" });
		return;
	}

	const token = addToken(address);
    
	res.send({ success: true, token: token });
};
