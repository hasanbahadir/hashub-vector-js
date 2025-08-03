/**
 * Hashub Vector SDK for TypeScript/JavaScript
 *
 * Official SDK for Hashub Vector API providing high-quality multilingual text embeddings
 * with exceptional Turkish language support.
 *
 * @example
 * ```typescript
 * import { HashubVector } from 'hashub-vector';
 *
 * const client = new HashubVector({
 *   apiKey: 'your-api-key'
 * });
 *
 * // Single embedding
 * const response = await client.vectorize({
 *   text: 'Merhaba dünya!',
 *   model: 'gte_base'
 * });
 *
 * console.log(response.vector);
 * ```
 *
 * @packageDocumentation
 */

// Main client class
export { HashubVector } from './client';

// Type definitions
export type {
  HashubVectorConfig,
  EmbeddingModel,
  VectorizeRequest,
  VectorizeBatchRequest,
  VectorizeResponse,
  VectorizeBatchResponse,
  ModelInfo,
  UsageStats,
  UsageResponse,
  DailyUsage,
  SimilarityRequest,
  SimilarityResponse,
  OpenAIEmbeddingRequest,
  OpenAIEmbeddingResponse,
  ApiError,
} from './types';

// Error classes
export {
  HashubVectorError,
  AuthenticationError,
  RateLimitError,
  QuotaExceededError,
  ValidationError,
  ServerError,
  NetworkError,
  TimeoutError,
} from './errors';

// Default export
export { HashubVector as default } from './client';
