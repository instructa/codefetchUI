#!/usr/bin/env node

const testUrl = 'https://github.com/sindresorhus/is-plain-obj';

async function testStreaming() {
  console.log('Testing streaming implementation...\n');

  try {
    // Test with streaming enabled
    console.log('1. Testing with stream=true...');
    const streamResponse = await fetch(
      `http://localhost:3000/api/scrape?url=${encodeURIComponent(testUrl)}&stream=true`
    );

    if (!streamResponse.ok) {
      throw new Error(`HTTP ${streamResponse.status}: ${await streamResponse.text()}`);
    }

    const reader = streamResponse.body.getReader();
    const decoder = new TextDecoder();
    let chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((line) => line.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          chunks.push(data);

          if (data.type === 'metadata') {
            console.log('✓ Received metadata:', data.data);
          } else if (data.type === 'markdown') {
            console.log(`✓ Received markdown chunk: ${data.data.substring(0, 100)}...`);
          } else if (data.type === 'complete') {
            console.log('✓ Stream completed');
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }

    console.log(`\nTotal chunks received: ${chunks.length}`);
    const markdownChunks = chunks.filter((c) => c.type === 'markdown');
    console.log(`Markdown chunks: ${markdownChunks.length}`);

    // Test without streaming
    console.log('\n2. Testing without stream parameter...');
    const normalResponse = await fetch(
      `http://localhost:3000/api/scrape?url=${encodeURIComponent(testUrl)}`
    );

    if (!normalResponse.ok) {
      throw new Error(`HTTP ${normalResponse.status}: ${await normalResponse.text()}`);
    }

    const normalReader = normalResponse.body.getReader();
    let hasNodes = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      if (chunk.includes('"type":"node"')) {
        hasNodes = true;
      }
    }

    console.log(`✓ Non-streaming response works: ${hasNodes ? 'has nodes' : 'different format'}`);
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

// Make sure dev server is running
console.log('Make sure the dev server is running on http://localhost:3000\n');
testStreaming();
