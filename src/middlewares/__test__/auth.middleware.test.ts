import { auth } from "../auth.middleware";

describe("auth.middleware", () => {
    const makeReq = () => {
        return {
            headers: {
                // Esse token é válido
                authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDdlMjcyNjJmZWRjODJhOTQ2MjIxZDQiLCJpYXQiOjE2ODU5ODkxNTh9.Uer1Le1EpHsbka88PJozlitNIr89Mc4I-_w-U_XHTNo",
            },
        } as any;
    };
    const req = makeReq();
    const res = {} as any;
    const next = (() => {}) as any;

    it("throws an error if JWT is invalid", () => {
        const req = makeReq();
        req.headers.authorization = "Bearer 34fdo";

        expect(() => auth(req, res, next)).toThrow();
    });

    it("works properly if authorization header is formatted correctly and the JWT is valid", () => {
        const mockNext = jest.fn(() => {}) as any;

        expect(() => auth(req, res, mockNext)).not.toThrow();
        expect(mockNext).toHaveBeenCalledTimes(1);
    });
});
