import { CustomError } from "./custom-error.error";

export class ExpiredError extends CustomError {
    status: number;
    type: string;

    constructor(message: string) {
        super();
        this.status = 400;
        this.type = "expired";
        this.message = message;
        Object.setPrototypeOf(this, ExpiredError.prototype);
    }

    toResponseError() {
        return { type: this.type, message: this.message };
    }
}
