# Hashub Vector SDK for TypeScript/JavaScript

[![npm version](https://badge.fury.io/js/hashub-vector.svg)](https://badge.fury.io/js/hashub-vector)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Node.js 16+](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dt/hashub-vector)](https://www.npmjs.com/package/hashub-vector)

**High-quality multilingual text embeddings with Turkish excellence** 🇹🇷

The official TypeScript/JavaScript SDK for Hashub Vector API - providing state-of-the-art text embeddings with exceptional Turkish language support and 80+ other languages.

## 🚀 Features

- **6 Premium Models** - From ultra-fast to premium quality
- **Turkish Excellence** - Optimized for Turkish market with exceptional Turkish language performance
- **80+ Languages** - Comprehensive multilingual support
- **Full TypeScript Support** - Complete type definitions and IntelliSense
- **Modern JavaScript** - ES modules, async/await, and Promise-based API
- **Browser & Node.js** - Works in both environments
- **OpenAI Compatible** - Drop-in replacement for OpenAI embeddings
- **Smart Retry Logic** - Automatic retries with exponential backoff
- **Zero Dependencies** - Only axios as runtime dependency

## 📦 Installation

```bash
npm install hashub-vector
```

For TypeScript projects (types included):
```bash
npm install hashub-vector
```

For browser usage via CDN:
```html
<script src="https://unpkg.com/hashub-vector@latest/dist/index.esm.js" type="module"></script>
```

## 🏃‍♂️ Quick Start

### TypeScript Example

```typescript
import { HashubVector } from 'hashub-vector';

// Initialize client
const client = new HashubVector({
  apiKey: 'your-api-key'
});

// Single text embedding
const response = await client.vectorize({
  text: 'Merhaba dünya! Hashub ile güçlü vektör embedding\'ler.',
  model: 'gte_base'
});

console.log(`Vector dimension: ${response.dimension}`);
console.log(`First 5 dimensions: ${response.vector.slice(0, 5)}`);

// Batch processing
const batchResponse = await client.vectorizeBatch({
  texts: [
    'Artificial intelligence is transforming the world',
    'Yapay zeka dünyayı dönüştürüyor',
    'L\'intelligence artificielle transforme le monde'
  ],
  model: 'gte_base'
});

console.log(`Processed ${batchResponse.count} texts`);
console.log(`Total tokens: ${batchResponse.totalTokens}`);
```

### JavaScript (ES Modules) Example

```javascript
import { HashubVector } from 'hashub-vector';

const client = new HashubVector({
  apiKey: process.env.HASHUB_API_KEY
});

// Calculate similarity
const similarity = await client.similarity({
  text1: 'Machine learning',
  text2: 'Makine öğrenmesi',
  model: 'gte_base'
});

console.log(`Similarity: ${similarity.similarity.toFixed(3)}`);
```

### CommonJS Example

```javascript
const { HashubVector } = require('hashub-vector');

const client = new HashubVector({
  apiKey: 'your-api-key'
});

async function example() {
  const response = await client.vectorize({
    text: 'Example text',
    model: 'e5_base'
  });
  
  console.log(response.vector);
}
```

## 🎯 Model Selection Guide

| Model | Best For | Dimension | Max Tokens | Price/1M | Turkish Support |
|-------|----------|-----------|------------|----------|-----------------|
| `gte_base` | Long documents, RAG | 768 | 8,192 | $0.01 | ⭐⭐⭐⭐⭐ |
| `nomic_base` | General purpose | 768 | 2,048 | $0.005 | ⭐⭐⭐⭐ |
| `e5_base` | Search, retrieval | 768 | 512 | $0.003 | ⭐⭐⭐⭐⭐ |
| `mpnet_base` | Q&A, similarity | 768 | 512 | $0.0035 | ⭐⭐⭐⭐⭐ |
| `e5_small` | High volume, speed | 384 | 512 | $0.002 | ⭐⭐⭐⭐ |
| `minilm_base` | Ultra-fast | 384 | 512 | $0.0025 | ⭐⭐⭐⭐ |

### Turkish Market Optimization

All models provide excellent Turkish language support, with `gte_base`, `e5_base`, and `mpnet_base` offering the highest quality for Turkish text processing.

```typescript
// Optimized for Turkish content
const response = await client.vectorize({
  text: 'Hashub Vector API ile Türkçe metinlerinizi güçlü vektörlere dönüştürün!',
  model: 'gte_base'  // Best for Turkish
});
```

## 🔄 OpenAI Compatibility

Drop-in replacement for OpenAI's embedding API:

```typescript
// OpenAI style (compatible)
const response = await client.createEmbedding({
  input: 'Your text here',
  model: 'e5_base'
});

const embedding = response.data[0].embedding;
console.log(`Generated ${embedding.length}D embedding`);

// Multiple texts
const response = await client.createEmbedding({
  input: ['Text 1', 'Text 2', 'Text 3'],
  model: 'gte_base'
});
```

## 🧠 Advanced Features

### Configuration Options

```typescript
const client = new HashubVector({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.vector.hashub.dev',  // Custom endpoint
  timeout: 30000,                             // 30 second timeout
  maxRetries: 3,                             // Retry failed requests
  headers: {                                 // Custom headers
    'X-Custom-Header': 'value'
  }
});
```

### Chunking for Long Documents

```typescript
// Automatic chunking for long texts
const response = await client.vectorize({
  text: longDocument,
  model: 'gte_base',
  chunkSize: 1024,
  chunkOverlap: 0.1  // 10% overlap
});

console.log(`Document split into ${response.chunkCount} chunks`);
```

### Model Information

```typescript
// Get available models
const models = await client.getModels();

for (const model of models) {
  console.log(`${model.alias}: ${model.description}`);
  console.log(`  Dimension: ${model.dimension}`);
  console.log(`  Max tokens: ${model.maxTokens}`);
  console.log(`  Turkish support: ${model.turkishSupport}/5`);
}
```

### Usage Monitoring

```typescript
// Check your usage
const usage = await client.getUsage();
console.log(`Tokens used: ${usage.tokensUsed.toLocaleString()}`);
console.log(`Usage percentage: ${usage.tokensPercentageUsed.toFixed(1)}%`);

// Detailed usage with date range
const detailedUsage = await client.getDetailedUsage('2025-08-01', '2025-08-07');
console.log(`Daily breakdown: ${detailedUsage.dailyUsage.length} days`);
```

## 🛠️ Integration Examples

### With React/Next.js

```typescript
import { HashubVector } from 'hashub-vector';
import { useState, useEffect } from 'react';

function EmbeddingComponent() {
  const [client] = useState(() => new HashubVector({
    apiKey: process.env.NEXT_PUBLIC_HASHUB_API_KEY!
  }));
  
  const [embedding, setEmbedding] = useState<number[]>([]);

  const generateEmbedding = async (text: string) => {
    try {
      const response = await client.vectorize({
        text,
        model: 'e5_base'
      });
      setEmbedding(response.vector);
    } catch (error) {
      console.error('Embedding failed:', error);
    }
  };

  return (
    <div>
      <button onClick={() => generateEmbedding('Example text')}>
        Generate Embedding
      </button>
      {embedding.length > 0 && (
        <p>Generated {embedding.length}D embedding</p>
      )}
    </div>
  );
}
```

### With Express.js

```typescript
import express from 'express';
import { HashubVector } from 'hashub-vector';

const app = express();
const client = new HashubVector({
  apiKey: process.env.HASHUB_API_KEY!
});

app.use(express.json());

app.post('/embed', async (req, res) => {
  try {
    const { text, model = 'e5_base' } = req.body;
    
    const response = await client.vectorize({ text, model });
    
    res.json({
      success: true,
      embedding: response.vector,
      dimension: response.dimension,
      tokens: response.tokens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## 🔧 Error Handling

```typescript
import {
  HashubVector,
  AuthenticationError,
  RateLimitError,
  QuotaExceededError,
  ValidationError,
  ServerError,
  NetworkError,
  TimeoutError
} from 'hashub-vector';

const client = new HashubVector({ apiKey: 'your-key' });

try {
  const response = await client.vectorize({
    text: 'Your text',
    model: 'e5_base'
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof QuotaExceededError) {
    console.log('Quota exceeded. Please upgrade your plan');
  } else if (error instanceof NetworkError) {
    console.log('Network connection issue');
  } else if (error instanceof TimeoutError) {
    console.log('Request timeout');
  }
}
```

## 🌍 Language Support

Hashub Vector SDK supports 80+ languages with excellent Turkish performance:

### Tier 1 (Excellent Performance)
🇹🇷 **Turkish**, English, German, French, Spanish, Italian, Portuguese, Dutch, Russian, Polish, Czech, Swedish, Danish, Norwegian, Finnish, Ukrainian

### Tier 2 (Very Good Performance)  
Arabic, Persian, Chinese, Japanese, Korean, Hindi, Bengali, Indonesian, Malay, Thai, Vietnamese, Bulgarian, Romanian, Hungarian, Croatian

### Tier 3 (Good Performance)
And 50+ additional languages including African, South Asian, and other European languages.

## 📊 Performance Benchmarks

### Speed Comparison (texts/second)
- `minilm_base`: ~950 texts/second (Ultra-fast)
- `e5_small`: ~780 texts/second (Fast)
- `e5_base`: ~520 texts/second (Balanced)
- `mpnet_base`: ~465 texts/second (Quality)
- `nomic_base`: ~350 texts/second (Premium)
- `gte_base`: ~280 texts/second (Maximum quality)

### Bundle Size
- **Minified**: ~45KB
- **Gzipped**: ~12KB
- **Dependencies**: axios only
- **Tree-shakable**: Yes

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run with coverage:

```bash
npm run test:coverage
```

Run examples:

```bash
npm run example:basic
npm run example:async
```

## 📚 API Reference

### HashubVector Class

#### Constructor
- `new HashubVector(config: HashubVectorConfig)`

#### Methods
- `vectorize(request: VectorizeRequest): Promise<VectorizeResponse>`
- `vectorizeBatch(request: VectorizeBatchRequest): Promise<VectorizeBatchResponse>`
- `similarity(request: SimilarityRequest): Promise<SimilarityResponse>`
- `getModels(): Promise<ModelInfo[]>`
- `getUsage(): Promise<UsageStats>`
- `getDetailedUsage(from?, to?): Promise<UsageResponse>`
- `createEmbedding(request: OpenAIEmbeddingRequest): Promise<OpenAIEmbeddingResponse>`

### Type Definitions

Full TypeScript definitions are included. Import types:

```typescript
import type {
  HashubVectorConfig,
  EmbeddingModel,
  VectorizeRequest,
  VectorizeResponse,
  // ... other types
} from 'hashub-vector';
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Development setup
git clone https://github.com/hasanbahadir/hashub-vector-js-sdk.git
cd hashub-vector-js-sdk
npm install
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [GitHub Repository](https://github.com/hasanbahadir/hashub-vector-js-sdk)
- **Issues**: [GitHub Issues](https://github.com/hasanbahadir/hashub-vector-js-sdk/issues)
- **Email**: [support@hashub.dev](mailto:support@hashub.dev)
- **NPM**: [hashub-vector](https://www.npmjs.com/package/hashub-vector)

## 🚀 What's Next?

Check out our roadmap for upcoming features:
- [ ] Browser-optimized bundle
- [ ] WebAssembly acceleration
- [ ] Streaming embeddings
- [ ] Vector database integrations
- [ ] Real-time similarity search
- [ ] Edge runtime support

---

**Made with ❤️ in Turkey** 🇹🇷

**Hashub Vector SDK** - Powering the next generation of AI applications with Turkish excellence.
