module.exports = {
  apps: [{
    name: 'mission-control',
    script: 'node_modules/next/dist/bin/next',
    args: 'dev',
    cwd: 'C:\\Users\\1990h\\.openclaw\\workspace\\projects\\task-board',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    interpreter: 'none',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    }
  }]
};
