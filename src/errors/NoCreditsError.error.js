const { CustomError } = require("./CustomError.error");

class NoCreditsError extends CustomError {
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

module.exports = { NoCreditsError };
