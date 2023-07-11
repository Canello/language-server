const { auth } = require("../auth.middleware");

describe("auth.middleware", () => {
    it("throws an error if JWT is invalid", () => {
        const req = {
            headers: {
                authorization: "Bearer 34fdo",
            },
        };

        expect(() => auth(req, {}, () => {})).toThrow();
    });

    it("works properly if authorization header is formatted correctly and the JWT is valid", () => {
        const req = {
            headers: {
                // Esse token é válido
                authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDdlMjcyNjJmZWRjODJhOTQ2MjIxZDQiLCJpYXQiOjE2ODU5ODkxNTh9.Uer1Le1EpHsbka88PJozlitNIr89Mc4I-_w-U_XHTNo",
            },
        };

        const mockNext = jest.fn(() => {});

        expect(() => auth(req, {}, mockNext)).not.toThrow();
        expect(mockNext).toHaveBeenCalledTimes(1);
    });
});
