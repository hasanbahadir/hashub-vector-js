/**
 * Test suite for error classes
 */

import {
  HashubVectorError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  ServerError,
  NetworkError,
  QuotaExceededError,
  TimeoutError
} from '../src/errors';

describe('Error Classes', () => {
  describe('HashubVectorError', () => {
    it('should create base error with correct properties', () => {
      const error = new HashubVectorError('Test error', 'TEST_ERROR', 500);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(HashubVectorError);
      expect(error.name).toBe('HashubVectorError');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.status).toBe(500);
    });

    it('should create error with minimal parameters', () => {
      const error = new HashubVectorError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.code).toBeUndefined();
      expect(error.status).toBeUndefined();
    });

    it('should create error with details', () => {
      const details = { field: 'value' };
      const error = new HashubVectorError('Test error', 'TEST_ERROR', 400, details);
      
      expect(error.message).toBe('Test error');
      expect(error.details).toEqual(details);
    });
  });

  describe('AuthenticationError', () => {
    it('should create authentication error with default message', () => {
      const error = new AuthenticationError();
      
      expect(error).toBeInstanceOf(HashubVectorError);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.name).toBe('AuthenticationError');
      expect(error.message).toBe('Invalid API key or authentication failed');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.status).toBe(401);
    });

    it('should create authentication error with custom message', () => {
      const error = new AuthenticationError('Custom auth error');
      
      expect(error.message).toBe('Custom auth error');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.status).toBe(401);
    });
  });

  describe('RateLimitError', () => {
    it('should create rate limit error with default message', () => {
      const error = new RateLimitError();
      
      expect(error).toBeInstanceOf(HashubVectorError);
      expect(error).toBeInstanceOf(RateLimitError);
      expect(error.name).toBe('RateLimitError');
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.code).toBe('RATE_LIMIT_ERROR');
      expect(error.status).toBe(429);
      expect(error.retryAfter).toBeUndefined();
    });

    it('should create rate limit error with retry after', () => {
      const error = new RateLimitError('Custom rate limit message', 60);
      
      expect(error.message).toBe('Custom rate limit message');
      expect(error.retryAfter).toBe(60);
    });
  });

  describe('QuotaExceededError', () => {
    it('should create quota exceeded error', () => {
      const error = new QuotaExceededError();
      
      expect(error).toBeInstanceOf(HashubVectorError);
      expect(error).toBeInstanceOf(QuotaExceededError);
      expect(error.name).toBe('QuotaExceededError');
      expect(error.message).toBe('Token quota exceeded');
      expect(error.code).toBe('QUOTA_EXCEEDED_ERROR');
      expect(error.status).toBe(402);
    });

    it('should create quota exceeded error with custom message', () => {
      const error = new QuotaExceededError('Custom quota message');
      
      expect(error.message).toBe('Custom quota message');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with default message', () => {
      const error = new ValidationError();
      
      expect(error).toBeInstanceOf(HashubVectorError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Request validation failed');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.status).toBe(400);
    });

    it('should create validation error with custom message', () => {
      const error = new ValidationError('Invalid request data');
      
      expect(error.message).toBe('Invalid request data');
    });
  });

  describe('ServerError', () => {
    it('should create server error with default message', () => {
      const error = new ServerError();
      
      expect(error).toBeInstanceOf(HashubVectorError);
      expect(error).toBeInstanceOf(ServerError);
      expect(error.name).toBe('ServerError');
      expect(error.message).toBe('Internal server error');
      expect(error.code).toBe('SERVER_ERROR');
      expect(error.status).toBe(500);
    });

    it('should create server error with custom message', () => {
      const error = new ServerError('Custom server error');
      
      expect(error.message).toBe('Custom server error');
    });
  });

  describe('NetworkError', () => {
    it('should create network error with default message', () => {
      const error = new NetworkError();
      
      expect(error).toBeInstanceOf(HashubVectorError);
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.name).toBe('NetworkError');
      expect(error.message).toBe('Network connection error');
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.status).toBeUndefined();
    });

    it('should create network error with custom message', () => {
      const error = new NetworkError('Connection timeout');
      
      expect(error.message).toBe('Connection timeout');
    });
  });

  describe('TimeoutError', () => {
    it('should create timeout error with default message', () => {
      const error = new TimeoutError();
      
      expect(error).toBeInstanceOf(HashubVectorError);
      expect(error).toBeInstanceOf(TimeoutError);
      expect(error.name).toBe('TimeoutError');
      expect(error.message).toBe('Request timeout');
      expect(error.code).toBe('TIMEOUT_ERROR');
      expect(error.status).toBeUndefined();
    });

    it('should create timeout error with custom message', () => {
      const error = new TimeoutError('Custom timeout message');
      
      expect(error.message).toBe('Custom timeout message');
    });
  });
});
