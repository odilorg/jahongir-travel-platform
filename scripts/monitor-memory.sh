#!/bin/bash

# Memory Monitoring Script for Jahongir Travel Platform
# Usage: ./scripts/monitor-memory.sh [interval_seconds]
# Example: ./scripts/monitor-memory.sh 60  (check every 60 seconds)

INTERVAL=${1:-300}  # Default: 5 minutes
API_URL=${2:-http://localhost:4000/health}
MEMORY_THRESHOLD_MB=${3:-400}  # Alert if memory exceeds 400MB

echo "🔍 Memory Monitoring Started"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Interval: ${INTERVAL}s | Threshold: ${MEMORY_THRESHOLD_MB}MB"
echo "API URL: ${API_URL}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

while true; do
  TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

  # Check if API is running
  if curl -s --max-time 5 "${API_URL}" > /dev/null 2>&1; then
    # Get health data
    HEALTH_DATA=$(curl -s "${API_URL}")

    # Extract memory info
    HEAP_USED=$(echo "$HEALTH_DATA" | jq -r '.memory.heapUsed' | grep -o '[0-9]*')
    RSS=$(echo "$HEALTH_DATA" | jq -r '.memory.rss' | grep -o '[0-9]*')
    UPTIME=$(echo "$HEALTH_DATA" | jq -r '.uptime')
    PID=$(echo "$HEALTH_DATA" | jq -r '.pid')

    # Display status
    echo "[$TIMESTAMP] PID: $PID | Uptime: $UPTIME | Heap: ${HEAP_USED}MB | RSS: ${RSS}MB"

    # Check threshold
    if [ "$HEAP_USED" -gt "$MEMORY_THRESHOLD_MB" ]; then
      echo "⚠️  WARNING: Memory usage (${HEAP_USED}MB) exceeds threshold (${MEMORY_THRESHOLD_MB}MB)!"

      # Optional: Auto-restart
      # Uncomment to enable auto-restart on high memory
      # echo "🔄 Auto-restarting API..."
      # pm2 restart api-dev
    fi
  else
    echo "[$TIMESTAMP] ❌ API not responding"
  fi

  echo ""
  sleep "$INTERVAL"
done
