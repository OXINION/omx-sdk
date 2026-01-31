#!/bin/bash

set -e

echo "🚀 Publishing all OMX SDK packages..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to publish a package
publish_package() {
    local package_dir=$1
    local package_name=$(grep '"name"' "$package_dir/package.json" | cut -d'"' -f4)
    local package_version=$(grep '"version"' "$package_dir/package.json" | cut -d'"' -f4)
    
    echo -e "${BLUE}📦 Publishing $package_name@$package_version...${NC}"
    
    cd "$package_dir"
    
    # Check if user is logged in to npm
    if ! npm whoami > /dev/null 2>&1; then
        echo -e "${RED}❌ Please log in to npm first: npm login${NC}"
        exit 1
    fi
    
    # Publish with latest tag
    if npm publish --tag latest; then
        echo -e "${GREEN}✅ Successfully published $package_name@$package_version${NC}"
    else
        echo -e "${RED}❌ Failed to publish $package_name@$package_version${NC}"
        exit 1
    fi
    
    cd - > /dev/null
}

# List of packages to publish (in dependency order)
packages=(
    "packages/shared"
    "packages/core" 
    "packages/geotrigger"
    "packages/email"
    "packages/webhook"
    "packages/notification"
    "packages/beacon"
    "packages/campaign"
    "packages/meta/omx-sdk"
)

echo "📋 Will publish ${#packages[@]} packages:"
for pkg in "${packages[@]}"; do
    package_name=$(grep '"name"' "$pkg/package.json" | cut -d'"' -f4)
    package_version=$(grep '"version"' "$pkg/package.json" | cut -d'"' -f4)
    echo "  • $package_name@$package_version"
done

echo ""
read -p "🤔 Continue with publishing? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publishing cancelled"
    exit 1
fi

echo "🚀 Starting publication process..."

# Publish each package
for pkg in "${packages[@]}"; do
    publish_package "$pkg"
    echo ""
done

echo -e "${GREEN}🎉 All packages published successfully!${NC}"
echo ""
echo "📦 Published packages:"
for pkg in "${packages[@]}"; do
    package_name=$(grep '"name"' "$pkg/package.json" | cut -d'"' -f4)
    package_version=$(grep '"version"' "$pkg/package.json" | cut -d'"' -f4)
    echo "  ✅ $package_name@$package_version"
done