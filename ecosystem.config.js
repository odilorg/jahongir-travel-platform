module.exports = {
  apps: [
    {
      name: 'jahongir-dev-api',
      cwd: '/var/www/jahongir-dev/apps/api',
      script: 'dist/src/main.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 4000,
      },
      error_file: '/var/log/pm2/jahongir-dev-api-error.log',
      out_file: '/var/log/pm2/jahongir-dev-api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'jahongir-dev-web',
      cwd: '/var/www/jahongir-dev/apps/web',
      script: 'npx',
      args: 'next start -p 3010',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3010,
      },
      error_file: '/var/log/pm2/jahongir-dev-web-error.log',
      out_file: '/var/log/pm2/jahongir-dev-web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'jahongir-dev-admin',
      cwd: '/var/www/jahongir-dev/apps/admin',
      script: 'npx',
      args: 'next dev -p 3011',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3011,
      },
      error_file: '/var/log/pm2/jahongir-dev-admin-error.log',
      out_file: '/var/log/pm2/jahongir-dev-admin-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
