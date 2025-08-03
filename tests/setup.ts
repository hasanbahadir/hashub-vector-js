/**
 * Jest setup file
 */

// Configure Jest environment
process.env.NODE_ENV = 'test';

// Setup global test environment
global.console = {
  ...console,
  // Uncomment to ignore warnings
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Configure timeouts
jest.setTimeout(10000);
