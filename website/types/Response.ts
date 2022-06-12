import { AuthUser } from "./Auth";

interface Response {
    success: boolean;
    result: any;
    error: string;
}

export interface AuthResponse extends Response {
    result: string;
}

export interface VerifyResponse extends Response {
    result: {
        user: AuthUser;
        sessionToken: string;
    };
}