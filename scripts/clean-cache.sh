#!/bin/bash

# Clean Cache Script for Jahongir Travel Platform
# Use this when experiencing slow dev server or high CPU usage
#
# Common signs you need to run this:
# - Dev server consuming 100% CPU
# - Slow hot reload (>2 seconds)
# - "FATAL ERROR: Ineffective mark-compacts" errors
# - Webpack compilation taking forever

set -e

echo "🧹 Cleaning Next.js cache and build artifacts..."

# Function to print size of directory
print_size() {
    if [ -d "$1" ]; then
        size=$(du -sh "$1" 2>/dev/null | cut -f1)
        echo "  📁 $1: $size"
    fi
}

# Show current sizes
echo ""
echo "Current cache sizes:"
print_size "apps/admin/.next"
print_size "apps/web/.next"
print_size ".turbo"
print_size "node_modules/.cache"

echo ""
echo "Cleaning..."

# Clean Next.js cache for admin (commonly bloated)
if [ -d "apps/admin/.next" ]; then
    rm -rf apps/admin/.next
    echo "  ✅ Cleaned apps/admin/.next"
fi

# Clean Next.js cache for web
if [ -d "apps/web/.next" ]; then
    rm -rf apps/web/.next
    echo "  ✅ Cleaned apps/web/.next"
fi

# Clean Turborepo cache
if [ -d ".turbo" ]; then
    rm -rf .turbo
    echo "  ✅ Cleaned .turbo"
fi

# Clean node_modules cache (optional, slower to rebuild)
if [ "$1" == "--deep" ]; then
    if [ -d "node_modules/.cache" ]; then
        rm -rf node_modules/.cache
        echo "  ✅ Cleaned node_modules/.cache"
    fi
fi

# Clean TypeScript build info
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true
echo "  ✅ Cleaned TypeScript build info"

echo ""
echo "✅ Cache cleaned successfully!"
echo ""
echo "Next steps:"
echo "  1. Run 'pnpm dev' to start fresh"
echo "  2. First build will be slower (cache rebuilding)"
echo ""
echo "💡 Tip: Run with --deep to also clean node_modules/.cache"
echo "   ./scripts/clean-cache.sh --deep"
