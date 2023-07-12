const { CustomError } = require("./custom-error.error");

class ExpiredError extends CustomError {
    constructor(message) {
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

module.exports = { ExpiredError };
