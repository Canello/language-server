const { CustomError } = require("./CustomError.error");

class InvalidInputError extends CustomError {
    constructor(message) {
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

module.exports = { InvalidInputError };
