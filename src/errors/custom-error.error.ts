export class CustomError extends Error {
    isCustom: boolean;

    constructor() {
        super();
        this.isCustom = true;
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    toResponseError() {}
}
