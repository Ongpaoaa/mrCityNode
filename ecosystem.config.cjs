module.exports = {
    apps: [
      {
        name: "server",                // Name of your application
        script: "./src/server.ts",     // Path to your server file
        interpreter: "ts-node-dev",    // Use ts-node-dev for TypeScript
        args: "--respawn",             // Restart on file changes
        watch: ["src"],                // Watch the src folder
        ignore_watch: ["node_modules"], // Ignore the node_modules folder
        env: {
          NODE_ENV: "development"      // Environment variable for development
        }
      }
    ]
  };
  