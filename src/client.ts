import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  HashubVectorConfig,
  VectorizeRequest,
  VectorizeBatchRequest,
  VectorizeResponse,
  VectorizeBatchResponse,
  ModelInfo,
  UsageStats,
  UsageResponse,
  SimilarityRequest,
  SimilarityResponse,
  OpenAIEmbeddingRequest,
  OpenAIEmbeddingResponse,
} from './types';
import {
  HashubVectorError,
  AuthenticationError,
  RateLimitError,
  QuotaExceededError,
  ValidationError,
  ServerError,
  NetworkError,
  TimeoutError,
} from './errors';

/**
 * Hashub Vector SDK Client for TypeScript/JavaScript
 *
 * Provides high-quality multilingual text embeddings with exceptional Turkish language support.
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
 * console.log(response.vector); // [0.1, -0.2, ...]
 * ```
 */
export class HashubVector {
  private readonly client: AxiosInstance;
  private readonly config: Required<HashubVectorConfig>;

  /**
   * Create a new Hashub Vector client
   *
   * @param config - Configuration options
   */
  constructor(config: HashubVectorConfig) {
    this.config = {
      baseUrl: 'https://api.vector.hashub.dev',
      timeout: 30000,
      maxRetries: 3,
      headers: {},
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'hashub-vector-js/1.0.0',
        ...this.config.headers,
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => this.handleError(error)
    );
  }

  /**
   * Generate embedding for a single text
   *
   * @param request - Vectorization request
   * @returns Promise<VectorizeResponse>
   *
   * @example
   * ```typescript
   * const response = await client.vectorize({
   *   text: 'Artificial intelligence is transforming the world',
   *   model: 'gte_base'
   * });
   *
   * console.log(`Vector dimension: ${response.dimension}`);
   * console.log(`Tokens used: ${response.tokens}`);
   * ```
   */
  async vectorize(request: VectorizeRequest): Promise<VectorizeResponse> {
    const response = await this.makeRequest<VectorizeResponse>('POST', '/vectorize', {
      text: request.text,
      model: request.model || 'e5_base',
      chunk_size: request.chunkSize,
      chunk_overlap: request.chunkOverlap,
    });

    return response;
  }

  /**
   * Generate embeddings for multiple texts (batch processing)
   *
   * @param request - Batch vectorization request
   * @returns Promise<VectorizeBatchResponse>
   *
   * @example
   * ```typescript
   * const response = await client.vectorizeBatch({
   *   texts: [
   *     'Hello world',
   *     'Merhaba dünya',
   *     'Bonjour monde'
   *   ],
   *   model: 'gte_base'
   * });
   *
   * console.log(`Processed ${response.count} texts`);
   * console.log(`Total tokens: ${response.totalTokens}`);
   * ```
   */
  async vectorizeBatch(request: VectorizeBatchRequest): Promise<VectorizeBatchResponse> {
    const response = await this.makeRequest<VectorizeBatchResponse>('POST', '/vectorize-batch', {
      texts: request.texts,
      model: request.model || 'e5_base',
      chunk_size: request.chunkSize,
      chunk_overlap: request.chunkOverlap,
    });

    return response;
  }

  /**
   * Calculate cosine similarity between two texts
   *
   * @param request - Similarity calculation request
   * @returns Promise<SimilarityResponse>
   *
   * @example
   * ```typescript
   * const response = await client.similarity({
   *   text1: 'Machine learning',
   *   text2: 'Makine öğrenmesi',
   *   model: 'gte_base'
   * });
   *
   * console.log(`Similarity: ${response.similarity.toFixed(3)}`);
   * ```
   */
  async similarity(request: SimilarityRequest): Promise<SimilarityResponse> {
    const response = await this.makeRequest<SimilarityResponse>('POST', '/similarity', {
      text1: request.text1,
      text2: request.text2,
      model: request.model || 'e5_base',
    });

    return response;
  }

  /**
   * Get information about available models
   *
   * @returns Promise<ModelInfo[]>
   *
   * @example
   * ```typescript
   * const models = await client.getModels();
   *
   * for (const model of models) {
   *   console.log(`${model.alias}: ${model.description}`);
   *   console.log(`  Dimension: ${model.dimension}`);
   *   console.log(`  Max tokens: ${model.maxTokens}`);
   *   console.log(`  Turkish support: ${model.turkishSupport}/5`);
   * }
   * ```
   */
  async getModels(): Promise<ModelInfo[]> {
    const response = await this.makeRequest<{ models: ModelInfo[] }>('GET', '/models');
    return response.models;
  }

  /**
   * Get current usage statistics
   *
   * @returns Promise<UsageStats>
   *
   * @example
   * ```typescript
   * const usage = await client.getUsage();
   *
   * console.log(`Tokens used: ${usage.tokensUsed.toLocaleString()}`);
   * console.log(`Usage: ${usage.tokensPercentageUsed.toFixed(1)}%`);
   * console.log(`Remaining: ${usage.tokensRemaining.toLocaleString()}`);
   * ```
   */
  async getUsage(): Promise<UsageStats> {
    const response = await this.makeRequest<UsageStats>('GET', '/usage');
    return response;
  }

  /**
   * Get detailed usage statistics with daily breakdown
   *
   * @param from - Start date (YYYY-MM-DD format, optional)
   * @param to - End date (YYYY-MM-DD format, optional)
   * @returns Promise<UsageResponse>
   *
   * @example
   * ```typescript
   * // Get last 7 days usage
   * const usage = await client.getDetailedUsage('2025-08-01', '2025-08-07');
   *
   * console.log(`Period: ${usage.period.from} to ${usage.period.to}`);
   * console.log(`Total tokens: ${usage.usage.tokensUsed}`);
   *
   * for (const day of usage.dailyUsage) {
   *   console.log(`${day.date}: ${day.tokensUsed} tokens, ${day.requestCount} requests`);
   * }
   * ```
   */
  async getDetailedUsage(from?: string, to?: string): Promise<UsageResponse> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const response = await this.makeRequest<UsageResponse>('GET', '/usage', undefined, { params });
    return response;
  }

  /**
   * OpenAI-compatible embedding endpoint
   *
   * @param request - OpenAI-style embedding request
   * @returns Promise<OpenAIEmbeddingResponse>
   *
   * @example
   * ```typescript
   * // Drop-in replacement for OpenAI
   * const response = await client.createEmbedding({
   *   input: 'Your text here',
   *   model: 'e5_base'
   * });
   *
   * const embedding = response.data[0].embedding;
   * console.log(`Generated ${embedding.length}D embedding`);
   * ```
   */
  async createEmbedding(request: OpenAIEmbeddingRequest): Promise<OpenAIEmbeddingResponse> {
    const response = await this.makeRequest<OpenAIEmbeddingResponse>('POST', '/embeddings', {
      input: request.input,
      model: request.model,
      user: request.user,
    });

    return response;
  }

  /**
   * Make HTTP request with error handling and retries
   */
  private async makeRequest<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        const response: AxiosResponse<T> = await this.client.request({
          method,
          url: endpoint,
          data,
          ...config,
        });

        return response.data;
      } catch (error: any) {
        lastError = error;

        // Don't retry on client errors (4xx except 429) or auth errors
        if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.config.maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Handle axios errors and convert to appropriate SDK errors
   */
  private handleError(error: any): never {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new TimeoutError('Request timeout');
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new NetworkError('Network connection error');
    }

    if (!error.response) {
      throw new NetworkError(error.message || 'Network error');
    }

    const { status, data } = error.response;
    const message = data?.message || data?.error || 'Unknown error';

    switch (status) {
      case 401:
        throw new AuthenticationError(message);
      case 402:
        throw new QuotaExceededError(message);
      case 400:
        throw new ValidationError(message);
      case 429: {
        const retryAfter = error.response.headers['retry-after'];
        throw new RateLimitError(message, retryAfter ? parseInt(retryAfter) : undefined);
      }
      case 500:
      case 502:
      case 503:
      case 504:
        throw new ServerError(message);
      default:
        throw new HashubVectorError(message, 'API_ERROR', status, data);
    }
  }
}
