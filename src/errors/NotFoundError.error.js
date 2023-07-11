const { CustomError } = require("./CustomError.error");

class NotFoundError extends CustomError {
    constructor(message) {
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

module.exports = { NotFoundError };
