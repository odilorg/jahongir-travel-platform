import { Controller, Get } from '@nestjs/common';

interface MemoryInfo {
  rss: string;
  heapUsed: string;
  heapTotal: string;
  external: string;
}

interface HealthResponse {
  status: string;
  uptime: string;
  memory: MemoryInfo;
  environment: string;
  timestamp: string;
  pid: number;
}

@Controller('health')
export class HealthController {
  @Get()
  check(): HealthResponse {
    const memoryUsage = process.memoryUsage();
    const uptimeSeconds = process.uptime();

    // Format uptime
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const uptimeFormatted = hours > 0
      ? `${hours}h ${minutes}m`
      : `${minutes}m`;

    return {
      status: 'ok',
      uptime: uptimeFormatted,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
      },
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      pid: process.pid,
    };
  }

  @Get('detailed')
  detailedCheck() {
    const memoryUsage = process.memoryUsage();
    const uptimeSeconds = process.uptime();

    // Format uptime
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    return {
      status: 'ok',
      uptime: {
        formatted: `${hours}h ${minutes}m ${seconds}s`,
        seconds: uptimeSeconds,
      },
      memory: {
        rss: {
          bytes: memoryUsage.rss,
          megabytes: Math.round(memoryUsage.rss / 1024 / 1024),
          description: 'Resident Set Size (total memory allocated)',
        },
        heapUsed: {
          bytes: memoryUsage.heapUsed,
          megabytes: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          description: 'Heap memory currently in use',
        },
        heapTotal: {
          bytes: memoryUsage.heapTotal,
          megabytes: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          description: 'Total heap allocated',
        },
        external: {
          bytes: memoryUsage.external,
          megabytes: Math.round(memoryUsage.external / 1024 / 1024),
          description: 'Memory used by C++ objects',
        },
      },
      process: {
        pid: process.pid,
        version: process.version,
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.versions.node,
        v8Version: process.versions.v8,
      },
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }
}
