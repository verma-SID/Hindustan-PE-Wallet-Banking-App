module.exports = {
    // Specify the test environment
    testEnvironment: "jsdom", // This is important for running tests involving the DOM
  
    // Define file patterns for your tests
    testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  
    // Define which directories should be searched for test files
    roots: ["<rootDir>/src"],
  
    // Set up a list of file extensions that Jest should use to search for tests
    moduleFileExtensions: ["js", "jsx", "json", "node"],
  
    // Configure Jest to transform files with Babel
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
  
    // Configure a module name mapper for handling CSS imports and axios
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "axios": "axios/dist/node/axios.cjs",
    },
  
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  };
  