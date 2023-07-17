const dotenv = require("dotenv");

beforeAll(() => {
    dotenv.config();
});

beforeEach(() => {
    jest.restoreAllMocks();
});
