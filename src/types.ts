/**
 * API Configuration for Hashub Vector client
 */
export interface HashubVectorConfig {
  /** API key for authentication */
  apiKey: string;
  /** Base URL for the API (optional) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Custom headers to include in requests */
  headers?: Record<string, string>;
}

/**
 * Available embedding models
 */
export type EmbeddingModel = 
  | 'gte_base'     // 768D, 8192 tokens - Best for long documents, RAG
  | 'nomic_base'   // 768D, 2048 tokens - General purpose
  | 'e5_base'      // 768D, 512 tokens - Excellent for search, retrieval
  | 'mpnet_base'   // 768D, 512 tokens - Q&A, similarity
  | 'e5_small'     // 384D, 512 tokens - High speed, large volumes
  | 'minilm_base'; // 384D, 512 tokens - Ultra-fast

/**
 * Single vectorization request
 */
export interface VectorizeRequest {
  /** Text to vectorize */
  text: string;
  /** Model to use for embedding */
  model?: EmbeddingModel;
  /** Maximum chunk size for long texts */
  chunkSize?: number;
  /** Overlap ratio between chunks (0-1) */
  chunkOverlap?: number;
}

/**
 * Batch vectorization request
 */
export interface VectorizeBatchRequest {
  /** Array of texts to vectorize */
  texts: string[];
  /** Model to use for embedding */
  model?: EmbeddingModel;
  /** Maximum chunk size for long texts */
  chunkSize?: number;
  /** Overlap ratio between chunks (0-1) */
  chunkOverlap?: number;
}

/**
 * Single vectorization response
 */
export interface VectorizeResponse {
  /** Generated embedding vector */
  vector: number[];
  /** Dimension of the vector */
  dimension: number;
  /** Model used for embedding */
  model: string;
  /** Number of tokens processed */
  tokens: number;
  /** Number of chunks (for long texts) */
  chunkCount?: number;
}

/**
 * Batch vectorization response
 */
export interface VectorizeBatchResponse {
  /** Array of embedding vectors */
  vectors: number[][];
  /** Dimension of vectors */
  dimension: number;
  /** Model used for embedding */
  model: string;
  /** Total number of texts processed */
  count: number;
  /** Total number of tokens processed */
  totalTokens: number;
}

/**
 * Model information
 */
export interface ModelInfo {
  /** Model identifier */
  alias: string;
  /** Human-readable name */
  name: string;
  /** Model description */
  description: string;
  /** Vector dimension */
  dimension: number;
  /** Maximum tokens per request */
  maxTokens: number;
  /** Price per 1M tokens in USD */
  pricePerMTokens: number;
  /** Turkish language support level (1-5) */
  turkishSupport: number;
}

/**
 * Usage statistics
 */
export interface UsageStats {
  /** Total tokens used */
  tokensUsed: number;
  /** Token limit */
  tokensLimit: number;
  /** Usage percentage */
  tokensPercentageUsed: number;
  /** Remaining tokens */
  tokensRemaining: number;
}

/**
 * Daily usage breakdown
 */
export interface DailyUsage {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Tokens used on this date */
  tokensUsed: number;
  /** Number of requests */
  requestCount: number;
  /** Models used with token counts */
  modelUsage: Record<string, number>;
}

/**
 * Detailed usage response
 */
export interface UsageResponse {
  /** Current usage statistics */
  usage: UsageStats;
  /** Daily usage breakdown */
  dailyUsage: DailyUsage[];
  /** Date range of the report */
  period: {
    from: string;
    to: string;
  };
}

/**
 * API Error response
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
  /** HTTP status code */
  status?: number;
  /** Additional error details */
  details?: Record<string, unknown>;
}

/**
 * Similarity calculation request
 */
export interface SimilarityRequest {
  /** First text */
  text1: string;
  /** Second text */
  text2: string;
  /** Model to use for embeddings */
  model?: EmbeddingModel;
}

/**
 * Similarity calculation response
 */
export interface SimilarityResponse {
  /** Cosine similarity score (0-1) */
  similarity: number;
  /** Model used */
  model: string;
}

/**
 * OpenAI-compatible embedding request
 */
export interface OpenAIEmbeddingRequest {
  /** Input text(s) */
  input: string | string[];
  /** Model to use */
  model: EmbeddingModel;
  /** User identifier (optional) */
  user?: string;
}

/**
 * OpenAI-compatible embedding response
 */
export interface OpenAIEmbeddingResponse {
  /** Response object type */
  object: 'list';
  /** Embedding data */
  data: Array<{
    object: 'embedding';
    embedding: number[];
    index: number;
  }>;
  /** Model used */
  model: string;
  /** Usage statistics */
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}
