# Server Management Scripts

## Memory Monitoring

### monitor-memory.sh

Monitors API memory usage in real-time and alerts on high memory.

**Usage:**
```bash
# Monitor every 5 minutes (default)
./scripts/monitor-memory.sh

# Monitor every 60 seconds
./scripts/monitor-memory.sh 60

# Custom threshold (400MB)
./scripts/monitor-memory.sh 300 http://localhost:4000/health 400
```

**Features:**
- Real-time memory monitoring
- Alerts when memory exceeds threshold
- Shows uptime, PID, heap usage, RSS
- Optional auto-restart (commented out by default)

**Example output:**
```
🔍 Memory Monitoring Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Interval: 300s | Threshold: 400MB
API URL: http://localhost:4000/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[2025-12-18 18:30:00] PID: 12345 | Uptime: 2h 15m | Heap: 156MB | RSS: 210MB
```

---

## Health Check Endpoints

The API now includes health check endpoints:

### Basic Health Check
```bash
curl http://localhost:4000/health
```

**Response:**
```json
{
  "status": "ok",
  "uptime": "2h 15m",
  "memory": {
    "rss": "210 MB",
    "heapUsed": "156 MB",
    "heapTotal": "180 MB",
    "external": "5 MB"
  },
  "environment": "development",
  "timestamp": "2025-12-18T15:30:00.000Z",
  "pid": 12345
}
```

### Detailed Health Check
```bash
curl http://localhost:4000/health/detailed
```

**Response includes:**
- Detailed memory breakdown
- Process information (Node version, platform, architecture)
- Full uptime metrics

---

## Automatic Restarts (Cron Jobs)

Cron jobs are configured to prevent memory leaks:

### View configured cron jobs
```bash
crontab -l
```

### Configured schedules:
- **Daily at 3 AM:** PM2 reload all (zero-downtime restart)
- **Weekly (Sunday 2 AM):** Clear PM2 logs

### Manually trigger restart
```bash
pm2 reload all
```

### View cron job logs
```bash
tail -f /var/log/pm2-cron-restart.log
```

---

## PM2 Memory Management

PM2 is configured with auto-restart on memory limits:

### View PM2 status
```bash
pm2 status
pm2 monit  # Real-time monitoring
```

### Memory limits (configured in ecosystem.config.js):
- **Dev servers:** 1GB (web-dev, admin-dev)
- **Dev API:** 500MB (api-dev)
- **Production servers:** 300MB (web-prod, admin-prod)
- **Production API:** 200MB (api-prod)

### Manually restart if high memory
```bash
pm2 restart api-dev
pm2 reload all  # Zero-downtime
```

---

## Troubleshooting

### Health endpoint not responding
```bash
# Check if API is running
pm2 status

# Restart API
pm2 restart api-dev

# Check logs
pm2 logs api-dev
```

### Monitoring script not working
```bash
# Ensure jq is installed
sudo apt install jq

# Check API is running
curl http://localhost:4000/health
```

### Cron job not executing
```bash
# Check cron service is running
systemctl status cron

# View cron logs
grep CRON /var/log/syslog

# Test PM2 path
which pm2
```

---

## Best Practices

1. **Monitor daily:** Check `pm2 status` for memory usage
2. **Review logs:** `tail -f /var/log/pm2-cron-restart.log`
3. **Alert on high memory:** Enable auto-restart in monitor-memory.sh
4. **Use production mode:** For long-running servers (weeks+)
5. **Check health endpoint:** `curl localhost:4000/health` weekly

---

**Last Updated:** 2025-12-18
