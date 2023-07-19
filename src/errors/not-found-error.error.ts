import { CustomError } from "./custom-error.error";

export class NotFoundError extends CustomError {
    status: number;
    type: string;

    constructor(message?: string) {
        super();
        this.status = 404;
        this.type = "not_found";
        this.message = message || "Não encontrado.";
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    toResponseError() {
        return { type: this.type, message: this.message };
    }
}
