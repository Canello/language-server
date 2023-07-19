import dotenv from "dotenv";

beforeAll(() => {
    dotenv.config();
});

beforeEach(() => {
    jest.restoreAllMocks();
});
