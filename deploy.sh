#!/bin/bash

echo "🚀 Deploying CodeFetch UI to Cloudflare Workers..."

# Build the project
echo "📦 Building the project..."
pnpm run build:prod

# Check if build was successful
if [ ! -f ".output/server/index.mjs" ]; then
  echo "❌ Build failed: .output/server/index.mjs not found"
  exit 1
fi

# Create a deployment wrapper that includes QuotaDO
echo "🔧 Creating deployment wrapper..."
cat > .output/server/deploy-wrapper.mjs << 'EOF'
// Import the Nitro server
import server from './index.mjs';

// Import and export the QuotaDO
import { QuotaDO } from '../../src/server/quota-do.js';

// Export the server as default and QuotaDO
export default server;
export { QuotaDO };
EOF

# Deploy using wrangler with the wrapper
echo "☁️ Deploying to Cloudflare..."
npx wrangler deploy .output/server/deploy-wrapper.mjs \
  --compatibility-date 2024-11-19 \
  --compatibility-flag nodejs_compat \
  --name codefetch-ui-dev \
  --no-bundle

echo "✅ Deployment complete!"