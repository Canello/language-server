const dotenv = require("dotenv");

beforeAll(() => {
    dotenv.config();
    jest.restoreAllMocks();
});
