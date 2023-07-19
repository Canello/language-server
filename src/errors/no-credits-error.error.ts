import { CustomError } from "./custom-error.error";

export class NoCreditsError extends CustomError {
    status: number;
    type: string;

    constructor() {
        super();
        this.status = 403;
        this.type = "no_credits";
        this.message = "Sem créditos.";
        Object.setPrototypeOf(this, NoCreditsError.prototype);
    }

    toResponseError() {
        return { type: this.type, message: this.message };
    }
}
