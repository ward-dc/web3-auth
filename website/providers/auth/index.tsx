import { createContext, useContext } from "react";
import login from "./login";

const auth = {
	login
};

export const context = createContext(auth);

export const useAuth = () => {
	return useContext(context);
};
