import { Request, Response } from "express";
import { parseCookies } from "nookies";
import { addToken } from "../../data/authTokens";
import prisma from "../../utils/prismaHandler";
module.exports = async (req: Request, res: Response) => {
	try {
		const { token }:any = req.query;
        console.log(token);
		const user = await prisma.user.findFirst({
			where: {
				sessions: {
					some: {
						id: token,
					},
				},
			},
		});
        console.log(user);
		if (user) {
			res.send({ success: true, result: user });
			return;
		}
		throw new Error("Invalid token");
	} catch (err: any) {
		res.send({ success: false, error: err?.message });
	}
};
