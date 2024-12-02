module.exports = {
  apps: [
    {
      name: "server",
      script: "./src/server.ts",
      interpreter: "ts-node", // Use ts-node to run the script
      watch: ["src"],         // Watch the src folder for changes
      ignore_watch: ["node_modules"], // Ignore node_modules
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};
