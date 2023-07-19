import { CustomError } from "./custom-error.error";

export class AuthenticationFailedError extends CustomError {
    status: number;
    type: string;

    constructor(message: string) {
        super();
        this.status = 401;
        this.type = "authentication_failed";
        this.message = message;
        Object.setPrototypeOf(this, AuthenticationFailedError.prototype);
    }

    toResponseError() {
        return { type: this.type, message: this.message };
    }
}
