class CustomError extends Error {
    constructor() {
        super();
        this.isCustom = true;
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    toResponseError() {}
}

module.exports = { CustomError };
