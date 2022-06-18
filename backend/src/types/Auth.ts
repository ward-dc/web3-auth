import { Ban } from "@prisma/client";

export interface AuthRequestData {
	id: string;
	address: string;
	time: Date;
}

export interface UserByAddress {
	bans: Ban[];
}