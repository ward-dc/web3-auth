import { generateMessage, generateToken } from "../utils/token";

interface TokenObject {
	id: string;
	address: string;
	time: Date;
}

let tokens: TokenObject[] = [];

export const addToken = (address: string): string => {
	const token = generateToken();
	const tokenObject: TokenObject = {
		id: token,
		address: address,
		time: new Date(),
	};

	tokens.push(tokenObject);
	return generateMessage(token);
};

export const cleanTokens = (): void => {
	tokens = tokens.filter((token) => {
		return token.time.getTime() > new Date().getTime() - 1000 * 60 * 60;
	});
};
