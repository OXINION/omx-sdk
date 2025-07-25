#!/bin/bash

# Script to manually publish packages to npm
# This script ensures proper build and publishes all packages

set -e

echo "🔍 Checking npm authentication..."
npm whoami

echo "🧹 Cleaning previous builds..."
pnpm clean

echo "🏗️  Building all packages..."
pnpm build

echo "🔍 Checking build outputs..."
for package in packages/*/; do
  if [ -d "$package/dist" ]; then
    echo "✅ Built: $package"
  else
    echo "❌ Missing build: $package"
    exit 1
  fi
done

echo "📦 Publishing packages..."
pnpm changeset publish

echo "✅ Successfully published all packages!"
echo "📝 Don't forget to:"
echo "   1. Tag the release: git tag v\$(jq -r .version packages/omx-sdk/package.json)"
echo "   2. Push tags: git push --tags"
echo "   3. Create GitHub release"
