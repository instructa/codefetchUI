The AI binding lets you run machine learning models using Cloudflare Workers AI directly from your Workers.

Minimal Example
Create a basic AI binding for text generation:

import { Worker, Ai } from "alchemy/cloudflare";

const ai = new Ai();

await Worker("ai-worker", {
  name: "ai-worker",
  entrypoint: "./src/worker.ts",
  bindings: {
    AI: ai,
  },
});

Text Generation
Use AI models for text generation tasks. See the text generation models documentation for available options.

import { Worker, Ai } from "alchemy/cloudflare";

const ai = new Ai();

await Worker("text-generator", {
  name: "text-generator",
  entrypoint: "./src/text.ts",
  bindings: {
    AI: ai,
  },
});

Worker implementation:

src/text.ts
export default {
  async fetch(request: Request, env: { AI: Ai }): Promise<Response> {
    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      prompt: "What is the capital of France?",
    });

    return new Response(JSON.stringify(response));
  },
};

Text Embeddings
Generate embeddings for semantic search and similarity. See the text embeddings models documentation for available options.

import { Worker, Ai } from "alchemy/cloudflare";

const ai = new Ai();

await Worker("embeddings-worker", {
  name: "embeddings-worker",
  entrypoint: "./src/embeddings.ts",
  bindings: {
    AI: ai,
  },
});

Worker implementation:

src/embeddings.ts
export default {
  async fetch(request: Request, env: { AI: Ai }): Promise<Response> {
    const response = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: ["Hello world", "Goodbye world"],
    });

    return new Response(JSON.stringify(response));
  },
};

Image Classification
Classify images using computer vision models. See the image classification models documentation for available options.

import { Worker, Ai } from "alchemy/cloudflare";

const ai = new Ai();

await Worker("image-classifier", {
  name: "image-classifier",
  entrypoint: "./src/image.ts",
  bindings: {
    AI: ai,
  },
});

Worker implementation:

src/image.ts
export default {
  async fetch(request: Request, env: { AI: Ai }): Promise<Response> {
    const imageArrayBuffer = await request.arrayBuffer();

    const response = await env.AI.run("@cf/microsoft/resnet-50", {
      image: imageArrayBuffer,
    });

    return new Response(JSON.stringify(response));
  },
};

With AI Gateway
Combine AI binding with AI Gateway for observability and control. Learn more about AI Gateway integration.

import { Worker, Ai, AiGateway } from "alchemy/cloudflare";

const aiGateway = await AiGateway("my-gateway", {
  name: "my-ai-gateway",
});

const ai = new Ai();

await Worker("gateway-ai-worker", {
  name: "gateway-ai-worker",
  entrypoint: "./src/gateway.ts",
  bindings: {
    AI: ai,
    GATEWAY: aiGateway,
  },
});

Worker implementation with gateway:

src/gateway.ts
export default {
  async fetch(request: Request, env: { AI: Ai }): Promise<Response> {
    const response = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        prompt: "Explain quantum computing",
      },
      {
        gateway: {
          id: "my-ai-gateway",
          cacheKey: "quantum-explanation",
          cacheTtl: 3600,
        },
      }
    );

    return new Response(JSON.stringify(response));
  },
};

Available Models
Workers AI supports 50+ open-source models across different categories including text generation, embeddings, image classification, and more.

Runtime Usage
The AI binding provides several methods in your Worker runtime. See the Workers AI API reference for complete details.

run(model, inputs, options?)
Run inference on a specific model:

const response = await env.AI.run(
  "@cf/meta/llama-3.1-8b-instruct",
  {
    prompt: "Your prompt here",
  },
  {
    gateway: { id: "my-gateway" },
  }
);

models(params?)
List available models:

const models = await env.AI.models();

gateway(gatewayId)
Get AI Gateway instance:

const gateway = env.AI.gateway("my-gateway-id");

TypeScript Support
For full type safety, you can specify model types:

import { Worker, Ai, type } from "alchemy/cloudflare";

interface MyAiModels {
  "@cf/meta/llama-3.1-8b-instruct": {
    inputs: { prompt: string };
    postProcessedOutputs: { response: string };
  };
}

const ai = new Ai<MyAiModels>();

Bind to a Worker
import { Worker, Ai } from "alchemy/cloudflare";

const ai = new Ai();

await Worker("my-worker", {
  name: "my-worker",
  entrypoint: "./src/worker.ts",
  bindings: {
    AI: ai,
  },
});