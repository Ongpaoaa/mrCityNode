export default {
  apps: [
    {
      name: 'my-app',
      script: 'npx',
      args: 'tsx src/server.ts',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
