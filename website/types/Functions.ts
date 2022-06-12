import { AuthUser } from "./Auth";

export type ErrHandler = (message: string) => void;

export type SetUser = (user: AuthUser) => void;