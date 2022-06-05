export const generateToken = (): string => {
	let token = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < 64; i++) {
		const index = Math.floor(Math.random() * possible.length);
		token += possible.substring(index, index + 1);
	}
	return token;
};

export const generateMessage = (token: string): string => {
	return `Authorize session:\n ${token}`;
};
