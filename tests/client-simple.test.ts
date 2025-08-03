/**
 * Simplified test suite for HashubVector client
 */

import { HashubVector } from '../src/client';
import { 
  AuthenticationError, 
  RateLimitError, 
  ValidationError 
} from '../src/errors';

describe('HashubVector Basic Tests', () => {
  let client: HashubVector;

  beforeEach(() => {
    client = new HashubVector({
      apiKey: 'hh_live_62e6dbc416cf7760d22db26fc5e0d31c'
    });
  });

  describe('constructor', () => {
    it('should create client with default config', () => {
      expect(client).toBeInstanceOf(HashubVector);
    });

    it('should create client with custom config', () => {
      const customClient = new HashubVector({
        apiKey: 'hh_live_62e6dbc416cf7760d22db26fc5e0d31c',
        baseUrl: 'https://vector.hashub.dev',
        timeout: 5000,
        maxRetries: 5
      });

      expect(customClient).toBeInstanceOf(HashubVector);
    });
  });

  describe('error classes', () => {
    it('should create authentication error', () => {
      const error = new AuthenticationError('Test auth error');
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.message).toBe('Test auth error');
      expect(error.name).toBe('AuthenticationError');
    });

    it('should create rate limit error', () => {
      const error = new RateLimitError('Test rate limit', 60);
      expect(error).toBeInstanceOf(RateLimitError);
      expect(error.message).toBe('Test rate limit');
      expect(error.retryAfter).toBe(60);
    });

    it('should create validation error', () => {
      const error = new ValidationError('Test validation error');
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Test validation error');
    });
  });

  describe('method existence', () => {
    it('should have vectorize method', () => {
      expect(typeof client.vectorize).toBe('function');
    });

    it('should have vectorizeBatch method', () => {
      expect(typeof client.vectorizeBatch).toBe('function');
    });

    it('should have similarity method', () => {
      expect(typeof client.similarity).toBe('function');
    });

    it('should have getModels method', () => {
      expect(typeof client.getModels).toBe('function');
    });

    it('should have getUsage method', () => {
      expect(typeof client.getUsage).toBe('function');
    });

    it('should have createEmbedding method', () => {
      expect(typeof client.createEmbedding).toBe('function');
    });
  });
});
