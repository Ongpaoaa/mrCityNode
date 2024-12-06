module.exports = {
  apps: [
    {
      name: 'my-app',                // Name of the application
      script: 'npx',                 // Use npx to call tsx
      args: 'tsx src/server.ts',     // Entry point for your TypeScript app
      instances: 1,                  // Number of instances (or 'max' for all CPU cores)
      autorestart: true,             // Auto-restart on crash
      watch: false,                  // Set to true if you want auto-restart on file changes
      max_memory_restart: '300M',    // Auto-restart if memory usage exceeds 300MB
      env: {
        NODE_ENV: 'development',     // Environment-specific variables
      },
      env_production: {
        NODE_ENV: 'production',      // Use this for production
      },
    },
  ],
};
