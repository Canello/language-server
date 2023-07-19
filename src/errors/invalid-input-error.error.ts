import { CustomError } from "./custom-error.error";

export class InvalidInputError extends CustomError {
    status: number;
    type: string;

    constructor(message: string) {
        super();
        this.status = 400;
        this.type = "invalid_input";
        this.message = message;
        Object.setPrototypeOf(this, InvalidInputError.prototype);
    }

    toResponseError() {
        return { type: this.type, message: this.message };
    }
}
