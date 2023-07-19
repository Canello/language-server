import { CustomError } from "./custom-error.error";

export class UsageLimitError extends CustomError {
    status: number;
    type: string;

    constructor() {
        super();
        this.status = 403;
        this.type = "reached_usage_limit";
        this.message = "Uso muito acima do normal.";
        Object.setPrototypeOf(this, UsageLimitError.prototype);
    }

    toResponseError() {
        return { type: this.type, message: this.message };
    }
}
