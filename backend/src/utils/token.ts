const prefix = "Authorize session: ";
const tokenLenght = 64;

export const generateToken = (): string => {
	let token = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < tokenLenght; i++) {
		const index = Math.floor(Math.random() * possible.length);
		token += possible.substring(index, index + 1);
	}
	return token;
};

export const generateMessage = (token: string): string => {
	return `${prefix}${token}`;
};

export const getTokenFromMessage = (message: string): string => {
	const token = message.replace(prefix, "");
	return token;
}
