module.exports = {
  apps: [
    // ================================
    // DEVELOPMENT MODE (for active dev)
    // ================================
    {
      name: 'web-dev',
      script: 'pnpm',
      args: '--filter web dev',
      cwd: '/home/odil/projects/jahongir-travel-platform',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',              // Auto-restart if exceeds 1GB
      exp_backoff_restart_delay: 100,        // Exponential backoff on crashes
      max_restarts: 10,                      // Max restarts in min_uptime window
      min_uptime: 2000,                      // Min uptime before considering stable
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: 1,
        NEXT_PUBLIC_API_URL: 'http://localhost:4000',
      },
      error_file: '/var/log/pm2/web-dev-error.log',
      out_file: '/var/log/pm2/web-dev-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    {
      name: 'admin-dev',
      script: 'pnpm',
      args: '--filter admin dev',
      cwd: '/home/odil/projects/jahongir-travel-platform',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: 2000,
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        NEXT_TELEMETRY_DISABLED: 1,
        NEXT_PUBLIC_API_URL: 'http://localhost:4000',
      },
      error_file: '/var/log/pm2/admin-dev-error.log',
      out_file: '/var/log/pm2/admin-dev-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    {
      name: 'api-dev',
      script: 'pnpm',
      args: '--filter api start:dev',
      cwd: '/home/odil/projects/jahongir-travel-platform',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',            // NestJS dev uses less memory
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: 2000,
      env: {
        NODE_ENV: 'development',
        PORT: 4000,
        DATABASE_URL: 'postgresql://postgres:password@localhost:5432/jahongir_travel_dev',
        REDIS_URL: 'redis://localhost:6379',
      },
      error_file: '/var/log/pm2/api-dev-error.log',
      out_file: '/var/log/pm2/api-dev-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },

    // ================================
    // PRODUCTION MODE (for VPS/staging)
    // ================================
    {
      name: 'web-prod',
      script: 'pnpm',
      args: '--filter web start',
      cwd: '/home/odil/projects/jahongir-travel-platform',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',            // Production uses much less memory
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'http://localhost:4000',
      },
      error_file: '/var/log/pm2/web-prod-error.log',
      out_file: '/var/log/pm2/web-prod-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    {
      name: 'admin-prod',
      script: 'pnpm',
      args: '--filter admin start',
      cwd: '/home/odil/projects/jahongir-travel-platform',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_API_URL: 'http://localhost:4000',
      },
      error_file: '/var/log/pm2/admin-prod-error.log',
      out_file: '/var/log/pm2/admin-prod-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    {
      name: 'api-prod',
      script: 'node',
      args: 'dist/main.js',                  // Direct node execution (no ts-node)
      cwd: '/home/odil/projects/jahongir-travel-platform/apps/api',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',            // NestJS prod ~100MB baseline
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        DATABASE_URL: 'postgresql://postgres:password@localhost:5432/jahongir_travel_prod',
        REDIS_URL: 'redis://localhost:6379',
      },
      error_file: '/var/log/pm2/api-prod-error.log',
      out_file: '/var/log/pm2/api-prod-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
