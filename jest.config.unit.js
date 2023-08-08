/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    restoreMocks: true,
    setupFilesAfterEnv: ["./src/test/setup-unit.ts"],
    testPathIgnorePatterns: ["/node_modules/", ".*e2e.*"],
};
