import { User } from "@prisma/client";
import { Role } from "@web3-auth/types/build/Auth";
import { UserByAddress } from "../types/Auth";

export function isBanned(user: UserByAddress) {
	for (const ban of user.bans) {
		if (ban.until > new Date()) {
			return true;
		}
	}
	return false;
}

export function isAdmin(user: User){
    const adminRole:Role = "ADMIN";
    return user.role === adminRole;
}
