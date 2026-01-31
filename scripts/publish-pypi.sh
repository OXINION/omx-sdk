#!/bin/bash

set -e

echo "🚀 Publishing omx-sdk to PyPI..."

# Navigate to py directory
cd "$(dirname "$0")/../py"

# Install build dependencies
echo "📦 Installing build dependencies..."
pip install --upgrade pip build twine

# Build the package
echo "🔨 Building package..."
python -m build

# Check the package
echo "🔍 Checking package..."
python -m twine check dist/*

# Upload to PyPI
echo "📤 Publishing to PyPI..."
echo "You will be prompted for your PyPI credentials or API token"
python -m twine upload dist/*

echo "✅ Successfully published omx-sdk to PyPI!"