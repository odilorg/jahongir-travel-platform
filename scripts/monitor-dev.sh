#!/bin/bash

# Dev Server Memory Monitor
# Monitors Next.js/Node.js processes and warns about memory leaks
#
# Usage: ./scripts/monitor-dev.sh
#
# Run in separate terminal while developing
# Will alert when memory exceeds thresholds

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Thresholds (MB)
WARNING_MB=1500
CRITICAL_MB=2500
CHECK_INTERVAL=30  # seconds

echo -e "${BLUE}🔍 Dev Server Memory Monitor${NC}"
echo "Checking every ${CHECK_INTERVAL}s | Warning: ${WARNING_MB}MB | Critical: ${CRITICAL_MB}MB"
echo "Press Ctrl+C to stop"
echo ""

alert_sent=false

while true; do
    timestamp=$(date '+%H:%M:%S')

    # Find Node.js processes related to Next.js/NestJS
    total_mb=0
    process_count=0

    while read -r pid rss comm; do
        if [ -n "$pid" ]; then
            mb=$((rss / 1024))
            total_mb=$((total_mb + mb))
            ((process_count++))
        fi
    done < <(pgrep -f "next-server|nest|turbo" -a 2>/dev/null | while read pid rest; do
        rss=$(ps -o rss= -p $pid 2>/dev/null)
        echo "$pid $rss $rest"
    done)

    # Also check generic node processes in project
    while read -r pid rss; do
        if [ -n "$pid" ] && [ -n "$rss" ]; then
            mb=$((rss / 1024))
            total_mb=$((total_mb + mb))
            ((process_count++))
        fi
    done < <(pgrep -f "node.*jahongir" 2>/dev/null | while read pid; do
        rss=$(ps -o rss= -p $pid 2>/dev/null)
        echo "$pid $rss"
    done)

    if [ "$process_count" -eq 0 ]; then
        echo -e "[$timestamp] ${YELLOW}No dev processes found${NC}"
    elif [ "$total_mb" -gt "$CRITICAL_MB" ]; then
        echo -e "[$timestamp] ${RED}❌ CRITICAL: ${total_mb}MB (${process_count} processes) - RESTART DEV SERVER!${NC}"
        if [ "$alert_sent" = false ]; then
            # Desktop notification (if available)
            notify-send "Memory Critical!" "Dev server using ${total_mb}MB. Restart recommended." 2>/dev/null || true
            alert_sent=true
        fi
    elif [ "$total_mb" -gt "$WARNING_MB" ]; then
        echo -e "[$timestamp] ${YELLOW}⚠️  Warning: ${total_mb}MB (${process_count} processes)${NC}"
        alert_sent=false
    else
        echo -e "[$timestamp] ${GREEN}✅ OK: ${total_mb}MB (${process_count} processes)${NC}"
        alert_sent=false
    fi

    sleep $CHECK_INTERVAL
done
