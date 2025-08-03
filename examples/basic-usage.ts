/**
 * Basic Usage Examples for Hashub Vector TypeScript SDK
 * 
 * This example demonstrates the fundamental features of the SDK:
 * - Single text embedding
 * - Batch processing
 * - Turkish language optimization
 * - Model comparison
 * - Similarity calculation
 * - Error handling
 * - Usage monitoring
 */

import { HashubVector, AuthenticationError, RateLimitError, QuotaExceededError } from '../src/index';

// Initialize client
const client = new HashubVector({
  apiKey: process.env.HASHUB_API_KEY || 'your-api-key-here',
  timeout: 30000,
  maxRetries: 3
});

async function basicUsageExample() {
  try {
    console.log('🚀 Hashub Vector TypeScript SDK - Basic Usage Examples');
    console.log('=' .repeat(60));

    // 1. Single Text Embedding
    console.log('\n📝 Single Text Embedding');
    console.log('-'.repeat(30));
    
    const singleResponse = await client.vectorize({
      text: 'Merhaba dünya! Hashub ile güçlü vektör embedding\'ler.',
      model: 'gte_base' // Best for Turkish
    });

    console.log(`✅ Vector dimension: ${singleResponse.dimension}`);
    console.log(`✅ Tokens used: ${singleResponse.tokens}`);
    console.log(`✅ Model used: ${singleResponse.model}`);
    console.log(`✅ First 5 dimensions: [${singleResponse.vector.slice(0, 5).map(v => v.toFixed(4)).join(', ')}]`);

    // 2. Batch Processing
    console.log('\n📦 Batch Processing');
    console.log('-'.repeat(20));

    const texts = [
      'Artificial intelligence is transforming the world',
      'Yapay zeka dünyayı dönüştürüyor',
      'L\'intelligence artificielle transforme le monde',
      'La inteligencia artificial está transformando el mundo'
    ];

    const batchResponse = await client.vectorizeBatch({
      texts,
      model: 'e5_base' // Good for multilingual
    });

    console.log(`✅ Processed ${batchResponse.count} texts`);
    console.log(`✅ Total tokens: ${batchResponse.totalTokens}`);
    console.log(`✅ Vector dimension: ${batchResponse.dimension}`);
    console.log(`✅ Generated ${batchResponse.vectors.length} embeddings`);

    // 3. Turkish Language Optimization
    console.log('\n🇹🇷 Turkish Language Optimization');
    console.log('-'.repeat(35));

    const turkishTexts = [
      'Makine öğrenmesi ve yapay zeka teknolojileri',
      'Doğal dil işleme ve metin analizi',
      'Vektör embedding ve semantik arama'
    ];

    const turkishResponse = await client.vectorizeBatch({
      texts: turkishTexts,
      model: 'gte_base' // Best Turkish support
    });

    console.log(`✅ Turkish texts processed: ${turkishResponse.count}`);
    console.log(`✅ Average token per text: ${(turkishResponse.totalTokens / turkishResponse.count).toFixed(1)}`);

    // 4. Model Comparison
    console.log('\n🔍 Available Models');
    console.log('-'.repeat(20));

    const models = await client.getModels();
    console.log('Available models:');
    
    for (const model of models) {
      console.log(`  🤖 ${model.alias.padEnd(12)} | ${model.dimension}D | ${model.maxTokens.toLocaleString().padStart(5)} tokens | Turkish: ${'⭐'.repeat(model.turkishSupport)}`);
    }

    // 5. Similarity Calculation
    console.log('\n🎯 Similarity Calculation');
    console.log('-'.repeat(25));

    const similarityResponse = await client.similarity({
      text1: 'Machine learning algorithms',
      text2: 'Makine öğrenmesi algoritmaları',
      model: 'gte_base'
    });

    console.log(`✅ Similarity (EN-TR): ${similarityResponse.similarity.toFixed(4)}`);
    console.log(`✅ Model used: ${similarityResponse.model}`);

    // Cross-lingual similarity tests
    const similarities = [
      { pair: 'AI Technology - Yapay Zeka Teknolojisi', lang: 'EN-TR' },
      { pair: 'Data Science - Veri Bilimi', lang: 'EN-TR' },
      { pair: 'Neural Networks - Sinir Ağları', lang: 'EN-TR' }
    ];

    for (const sim of similarities) {
      const [text1, text2] = sim.pair.split(' - ');
      const result = await client.similarity({
        text1,
        text2,
        model: 'gte_base'
      });
      console.log(`  ${sim.lang}: ${result.similarity.toFixed(4)} | ${sim.pair}`);
    }

    // 6. Usage Monitoring
    console.log('\n📊 Usage Statistics');
    console.log('-'.repeat(20));

    const usage = await client.getUsage();
    console.log(`✅ Tokens used: ${usage.tokensUsed.toLocaleString()}`);
    console.log(`✅ Usage percentage: ${usage.tokensPercentageUsed.toFixed(1)}%`);
    console.log(`✅ Remaining tokens: ${usage.tokensRemaining.toLocaleString()}`);

    // 7. Detailed Usage (last 7 days)
    const detailedUsage = await client.getDetailedUsage();
    console.log(`✅ Report period: ${detailedUsage.period.from} to ${detailedUsage.period.to}`);
    console.log(`✅ Daily breakdown: ${detailedUsage.dailyUsage.length} days`);

    if (detailedUsage.dailyUsage.length > 0) {
      console.log('Recent daily usage:');
      detailedUsage.dailyUsage.slice(-3).forEach(day => {
        console.log(`  📅 ${day.date}: ${day.tokensUsed.toLocaleString()} tokens, ${day.requestCount} requests`);
      });
    }

    // 8. OpenAI Compatibility
    console.log('\n🔄 OpenAI Compatibility');
    console.log('-'.repeat(25));

    const openaiResponse = await client.createEmbedding({
      input: 'Drop-in replacement for OpenAI embeddings',
      model: 'e5_base'
    });

    console.log(`✅ OpenAI format response: ${openaiResponse.data.length} embedding(s)`);
    console.log(`✅ Usage tokens: ${openaiResponse.usage.total_tokens}`);
    console.log(`✅ Embedding dimension: ${openaiResponse.data[0].embedding.length}`);

    console.log('\n🎉 All examples completed successfully!');

  } catch (error) {
    console.error('\n❌ Error occurred:', error);
    
    if (error instanceof AuthenticationError) {
      console.log('💡 Please check your API key');
    } else if (error instanceof RateLimitError) {
      console.log(`💡 Rate limited. Retry after ${error.retryAfter} seconds`);
    } else if (error instanceof QuotaExceededError) {
      console.log('💡 Quota exceeded. Please upgrade your plan');
    }
  }
}

// Performance benchmark
async function performanceBenchmark() {
  console.log('\n⚡ Performance Benchmark');
  console.log('-'.repeat(25));

  const testTexts = Array.from({ length: 50 }, (_, i) => 
    `Bu test metni ${i + 1}. Performans testi için kullanılıyor.`
  );

  const startTime = Date.now();
  
  const response = await client.vectorizeBatch({
    texts: testTexts,
    model: 'e5_small' // Fastest model
  });

  const endTime = Date.now();
  const duration = endTime - startTime;
  const tokensPerSecond = (response.totalTokens / duration * 1000).toFixed(0);

  console.log(`✅ Processed ${response.count} texts in ${duration}ms`);
  console.log(`✅ Speed: ~${tokensPerSecond} tokens/second`);
  console.log(`✅ Average time per text: ${(duration / response.count).toFixed(1)}ms`);
}

// Run examples
async function runExamples() {
  await basicUsageExample();
  await performanceBenchmark();
}

// Execute if run directly
if (require.main === module) {
  runExamples().catch(console.error);
}

export { runExamples };
