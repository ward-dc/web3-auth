export class Error {
    public message:string;
    public code: ErrorCode;
    constructor(message: string, code: ErrorCode = 400) { 
        this.message = message;
        this.code = code;
    }
}

export type ErrorCode = 400 | 401 | 403 | 404 | 500;
export type StatusCode = 200 | ErrorCode