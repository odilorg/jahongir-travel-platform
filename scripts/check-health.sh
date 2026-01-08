#!/bin/bash

# Health Check Script for Jahongir Travel Platform
# Run before dev, in CI/CD, or when experiencing issues
#
# Checks:
# 1. Cache size (warns if too large)
# 2. Component file sizes (warns if >300 lines)
# 3. Memory usage
# 4. Disk space
# 5. Node.js memory settings

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

WARNINGS=0
ERRORS=0

echo "🔍 Running health checks..."
echo ""

# ============================================
# 1. CACHE SIZE CHECK
# ============================================
echo "📦 Checking cache sizes..."

check_cache_size() {
    local dir=$1
    local max_mb=$2
    local name=$3

    if [ -d "$dir" ]; then
        size_kb=$(du -sk "$dir" 2>/dev/null | cut -f1)
        size_mb=$((size_kb / 1024))

        if [ "$size_mb" -gt "$max_mb" ]; then
            echo -e "  ${RED}❌ $name: ${size_mb}MB (max: ${max_mb}MB) - RUN: ./scripts/clean-cache.sh${NC}"
            ((ERRORS++))
        elif [ "$size_mb" -gt $((max_mb / 2)) ]; then
            echo -e "  ${YELLOW}⚠️  $name: ${size_mb}MB (warning threshold: $((max_mb / 2))MB)${NC}"
            ((WARNINGS++))
        else
            echo -e "  ${GREEN}✅ $name: ${size_mb}MB${NC}"
        fi
    else
        echo -e "  ${GREEN}✅ $name: Not present (clean)${NC}"
    fi
}

# Cache thresholds (MB)
check_cache_size "apps/admin/.next" 100 "Admin .next cache"
check_cache_size "apps/web/.next" 50 "Web .next cache"
check_cache_size ".turbo" 200 "Turbo cache"
check_cache_size "node_modules/.cache" 500 "Node modules cache"

echo ""

# ============================================
# 2. LARGE COMPONENT CHECK
# ============================================
echo "📄 Checking component file sizes..."

MAX_LINES=300
LARGE_FILES=()

while IFS= read -r -d '' file; do
    lines=$(wc -l < "$file")
    if [ "$lines" -gt "$MAX_LINES" ]; then
        LARGE_FILES+=("$file:$lines")
    fi
done < <(find apps/admin/components apps/web/components packages -name "*.tsx" -type f -print0 2>/dev/null)

if [ ${#LARGE_FILES[@]} -gt 0 ]; then
    echo -e "  ${YELLOW}⚠️  Found ${#LARGE_FILES[@]} files over $MAX_LINES lines:${NC}"
    for entry in "${LARGE_FILES[@]}"; do
        file="${entry%:*}"
        lines="${entry#*:}"
        echo -e "     ${YELLOW}- $file ($lines lines)${NC}"
    done
    ((WARNINGS++))
else
    echo -e "  ${GREEN}✅ All components under $MAX_LINES lines${NC}"
fi

echo ""

# ============================================
# 3. MEMORY USAGE CHECK
# ============================================
echo "💾 Checking system memory..."

# Get memory info
mem_total=$(free -m | awk '/^Mem:/{print $2}')
mem_used=$(free -m | awk '/^Mem:/{print $3}')
mem_percent=$((mem_used * 100 / mem_total))

if [ "$mem_percent" -gt 85 ]; then
    echo -e "  ${RED}❌ Memory usage: ${mem_percent}% (${mem_used}MB / ${mem_total}MB) - Too high!${NC}"
    ((ERRORS++))
elif [ "$mem_percent" -gt 70 ]; then
    echo -e "  ${YELLOW}⚠️  Memory usage: ${mem_percent}% (${mem_used}MB / ${mem_total}MB)${NC}"
    ((WARNINGS++))
else
    echo -e "  ${GREEN}✅ Memory usage: ${mem_percent}% (${mem_used}MB / ${mem_total}MB)${NC}"
fi

echo ""

# ============================================
# 4. DISK SPACE CHECK
# ============================================
echo "💿 Checking disk space..."

disk_percent=$(df -h . | awk 'NR==2 {gsub(/%/,""); print $5}')
disk_avail=$(df -h . | awk 'NR==2 {print $4}')

if [ "$disk_percent" -gt 90 ]; then
    echo -e "  ${RED}❌ Disk usage: ${disk_percent}% (${disk_avail} available) - Critical!${NC}"
    ((ERRORS++))
elif [ "$disk_percent" -gt 80 ]; then
    echo -e "  ${YELLOW}⚠️  Disk usage: ${disk_percent}% (${disk_avail} available)${NC}"
    ((WARNINGS++))
else
    echo -e "  ${GREEN}✅ Disk usage: ${disk_percent}% (${disk_avail} available)${NC}"
fi

echo ""

# ============================================
# 5. NODE.JS SETTINGS CHECK
# ============================================
echo "⚙️  Checking Node.js configuration..."

node_version=$(node --version 2>/dev/null || echo "not found")
if [[ "$node_version" == v2* ]]; then
    echo -e "  ${GREEN}✅ Node.js: $node_version${NC}"
else
    echo -e "  ${YELLOW}⚠️  Node.js: $node_version (recommend v20+)${NC}"
    ((WARNINGS++))
fi

# Check NODE_OPTIONS for memory limits
if [ -n "$NODE_OPTIONS" ]; then
    echo -e "  ${GREEN}✅ NODE_OPTIONS: $NODE_OPTIONS${NC}"
else
    echo -e "  ${YELLOW}💡 Tip: Set NODE_OPTIONS=\"--max-old-space-size=4096\" for large projects${NC}"
fi

echo ""

# ============================================
# 6. TYPESCRIPT BUILD INFO CHECK
# ============================================
echo "📝 Checking TypeScript build info..."

tsbuildinfo_count=$(find . -name "*.tsbuildinfo" -type f 2>/dev/null | wc -l)
if [ "$tsbuildinfo_count" -gt 10 ]; then
    echo -e "  ${YELLOW}⚠️  Found $tsbuildinfo_count .tsbuildinfo files (consider cleaning)${NC}"
    ((WARNINGS++))
else
    echo -e "  ${GREEN}✅ TypeScript build files: $tsbuildinfo_count${NC}"
fi

echo ""

# ============================================
# SUMMARY
# ============================================
echo "════════════════════════════════════════"
if [ "$ERRORS" -gt 0 ]; then
    echo -e "${RED}❌ Health check FAILED: $ERRORS errors, $WARNINGS warnings${NC}"
    echo ""
    echo "Recommended actions:"
    echo "  1. Run: ./scripts/clean-cache.sh"
    echo "  2. Close unused applications"
    echo "  3. Check for runaway processes: htop"
    exit 1
elif [ "$WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Health check PASSED with $WARNINGS warnings${NC}"
    echo ""
    echo "Consider running: ./scripts/clean-cache.sh"
    exit 0
else
    echo -e "${GREEN}✅ All health checks passed!${NC}"
    exit 0
fi
