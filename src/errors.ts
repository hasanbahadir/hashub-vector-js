/**
 * Base error class for Hashub Vector SDK
 */
export class HashubVectorError extends Error {
  public readonly code?: string | undefined;
  public readonly status?: number | undefined;
  public readonly details?: Record<string, unknown> | undefined;

  constructor(message: string, code?: string, status?: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'HashubVectorError';
    this.code = code;
    this.status = status;
    this.details = details;

    // Maintain proper stack trace for where our error was thrown
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, HashubVectorError);
    }
  }
}

/**
 * Authentication error (401)
 */
export class AuthenticationError extends HashubVectorError {
  constructor(message: string = 'Invalid API key or authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends HashubVectorError {
  public readonly retryAfter?: number | undefined;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 'RATE_LIMIT_ERROR', 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Quota exceeded error (402)
 */
export class QuotaExceededError extends HashubVectorError {
  constructor(message: string = 'Token quota exceeded') {
    super(message, 'QUOTA_EXCEEDED_ERROR', 402);
    this.name = 'QuotaExceededError';
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends HashubVectorError {
  constructor(message: string = 'Request validation failed') {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

/**
 * Server error (500)
 */
export class ServerError extends HashubVectorError {
  constructor(message: string = 'Internal server error') {
    super(message, 'SERVER_ERROR', 500);
    this.name = 'ServerError';
  }
}

/**
 * Network error (connection issues)
 */
export class NetworkError extends HashubVectorError {
  constructor(message: string = 'Network connection error') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends HashubVectorError {
  constructor(message: string = 'Request timeout') {
    super(message, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
  }
}
