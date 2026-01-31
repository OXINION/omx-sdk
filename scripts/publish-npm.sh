#!/bin/bash

set -e

echo "🚀 Publishing omx-sdk to npm..."

# Navigate to js directory
cd "$(dirname "$0")/../js"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build all packages
echo "🔨 Building packages..."
pnpm build

# Navigate to the main package
cd packages/meta/omx-sdk

# Check if user is logged in to npm
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Please log in to npm first: npm login"
    exit 1
fi

# Publish the package
echo "📤 Publishing to npm..."
npm publish

echo "✅ Successfully published omx-sdk to npm!"