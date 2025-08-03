/**
 * Async Examples for Hashub Vector TypeScript SDK
 * 
 * This example demonstrates advanced async patterns:
 * - Concurrent processing
 * - Promise.all batch operations
 * - Async iterators
 * - Error handling with async/await
 * - Real-time processing
 */

import { HashubVector } from '../src/index';

// Initialize client
const client = new HashubVector({
  apiKey: process.env.HASHUB_API_KEY || 'hh_live_62e6dbc416cf7760d22db26fc5e0d31c'
});

/**
 * Concurrent processing example
 */
async function concurrentProcessing() {
  console.log('🚀 Concurrent Processing Example');
  console.log('-'.repeat(35));

  const textGroups = [
    ['AI and machine learning', 'Yapay zeka ve makine öğrenmesi'],
    ['Natural language processing', 'Doğal dil işleme'],
    ['Computer vision systems', 'Bilgisayarlı görü sistemleri'],
    ['Data science applications', 'Veri bilimi uygulamaları']
  ];

  const startTime = Date.now();

  // Process all groups concurrently
  const results = await Promise.all(
    textGroups.map(async (texts, index) => {
      const response = await client.vectorizeBatch({
        texts,
        model: 'e5_base'
      });
      
      return {
        groupIndex: index,
        count: response.count,
        tokens: response.totalTokens,
        dimension: response.dimension
      };
    })
  );

  const endTime = Date.now();

  console.log(`✅ Processed ${results.length} groups concurrently in ${endTime - startTime}ms`);
  
  results.forEach((result, index) => {
    console.log(`  Group ${index + 1}: ${result.count} texts, ${result.tokens} tokens`);
  });

  const totalTokens = results.reduce((sum, result) => sum + result.tokens, 0);
  console.log(`✅ Total tokens processed: ${totalTokens}`);
}

/**
 * Async iterator for processing large datasets
 */
async function* processLargeDataset(texts: string[], batchSize: number = 10) {
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    
    try {
      const response = await client.vectorizeBatch({
        texts: batch,
        model: 'e5_small' // Fast processing
      });

      yield {
        batchIndex: Math.floor(i / batchSize),
        startIndex: i,
        endIndex: Math.min(i + batchSize - 1, texts.length - 1),
        count: response.count,
        tokens: response.totalTokens,
        vectors: response.vectors
      };
    } catch (error) {
      console.error(`Error processing batch ${Math.floor(i / batchSize)}:`, error);
      yield {
        batchIndex: Math.floor(i / batchSize),
        startIndex: i,
        endIndex: Math.min(i + batchSize - 1, texts.length - 1),
        error: error instanceof Error ? error.message : 'Unknown error',
        count: 0,
        tokens: 0,
        vectors: []
      };
    }
  }
}

/**
 * Large dataset processing example
 */
async function largeDatasetExample() {
  console.log('\n📊 Large Dataset Processing');
  console.log('-'.repeat(30));

  // Generate test dataset
  const largeDataset = Array.from({ length: 100 }, (_, i) => 
    `Test document ${i + 1}: This is sample text for batch processing demonstration. ` +
    `Turkish content: Bu örnek metin ${i + 1} numaralı belge içeriğidir.`
  );

  console.log(`📁 Processing ${largeDataset.length} documents in batches...`);

  let totalProcessed = 0;
  let totalTokens = 0;
  let totalErrors = 0;

  const startTime = Date.now();

  // Process using async iterator
  for await (const batch of processLargeDataset(largeDataset, 15)) {
    if ('error' in batch) {
      totalErrors++;
      console.log(`❌ Batch ${batch.batchIndex}: Error - ${batch.error}`);
    } else {
      totalProcessed += batch.count;
      totalTokens += batch.tokens;
      console.log(`✅ Batch ${batch.batchIndex}: ${batch.count} docs, ${batch.tokens} tokens`);
    }
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  console.log(`\n📈 Processing Complete:`);
  console.log(`  ✅ Documents processed: ${totalProcessed}/${largeDataset.length}`);
  console.log(`  ✅ Total tokens: ${totalTokens.toLocaleString()}`);
  console.log(`  ✅ Processing time: ${duration}ms`);
  console.log(`  ✅ Average time per document: ${(duration / totalProcessed).toFixed(1)}ms`);
  console.log(`  ❌ Errors: ${totalErrors}`);
}

/**
 * Real-time similarity search
 */
async function realTimeSearch() {
  console.log('\n🔍 Real-time Similarity Search');
  console.log('-'.repeat(32));

  // Knowledge base
  const knowledgeBase = [
    'Machine learning algorithms and neural networks',
    'Makine öğrenmesi algoritmaları ve sinir ağları',
    'Deep learning and artificial intelligence',
    'Derin öğrenme ve yapay zeka',
    'Natural language processing techniques',
    'Doğal dil işleme teknikleri',
    'Computer vision and image recognition',
    'Bilgisayarlı görü ve görüntü tanıma'
  ];

  // Pre-compute embeddings for knowledge base
  console.log('📚 Building knowledge base embeddings...');
  const kbEmbeddings = await client.vectorizeBatch({
    texts: knowledgeBase,
    model: 'gte_base'
  });

  // Search queries
  const queries = [
    'AI and deep learning',
    'Yapay zeka teknolojileri',
    'Image processing algorithms'
  ];

  console.log('\n🔎 Performing similarity searches...');

  for (const query of queries) {
    const startTime = Date.now();
    
    // Get query embedding
    const queryResponse = await client.vectorize({
      text: query,
      model: 'gte_base'
    });

    // Calculate similarities (client-side)
    const similarities = kbEmbeddings.vectors.map((kbVector, index) => {
      const similarity = cosineSimilarity(queryResponse.vector, kbVector);
      return {
        text: knowledgeBase[index],
        similarity,
        index
      };
    });

    // Sort by similarity (descending)
    similarities.sort((a, b) => b.similarity - a.similarity);

    const endTime = Date.now();

    console.log(`\n🎯 Query: "${query}"`);
    console.log(`   Search time: ${endTime - startTime}ms`);
    console.log('   Top matches:');
    
    similarities.slice(0, 3).forEach((match, i) => {
      console.log(`     ${i + 1}. ${match.similarity.toFixed(4)} | ${match.text}`);
    });
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Error handling patterns
 */
async function errorHandlingPatterns() {
  console.log('\n⚠️  Error Handling Patterns');
  console.log('-'.repeat(28));

  // Pattern 1: Retry with exponential backoff
  async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries - 1) throw error;
        
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`❌ Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }

  // Pattern 2: Graceful degradation
  async function withFallback(primaryModel: string, fallbackModel: string, text: string) {
    try {
      return await client.vectorize({ text, model: primaryModel as any });
    } catch (error) {
      console.log(`⚠️ Primary model failed, using fallback: ${fallbackModel}`);
      return await client.vectorize({ text, model: fallbackModel as any });
    }
  }

  // Demonstrate patterns
  try {
    console.log('🔄 Testing retry pattern...');
    await withRetry(async () => {
      return await client.vectorize({
        text: 'Test retry pattern',
        model: 'e5_base'
      });
    });
    console.log('✅ Retry pattern succeeded');

    console.log('🔄 Testing fallback pattern...');
    const result = await withFallback('gte_base', 'e5_base', 'Test fallback pattern');
    console.log(`✅ Fallback pattern succeeded with model: ${result.model}`);

  } catch (error) {
    console.error('❌ Error handling demonstration failed:', error);
  }
}

/**
 * Run all async examples
 */
async function runAsyncExamples() {
  console.log('🚀 Hashub Vector TypeScript SDK - Async Examples');
  console.log('='.repeat(55));

  try {
    await concurrentProcessing();
    await largeDatasetExample();
    await realTimeSearch();
    await errorHandlingPatterns();

    console.log('\n🎉 All async examples completed successfully!');
  } catch (error) {
    console.error('\n❌ Async examples failed:', error);
  }
}

// Execute if run directly
if (typeof require !== 'undefined' && require.main === module) {
  runAsyncExamples().catch(console.error);
}

export { runAsyncExamples };
