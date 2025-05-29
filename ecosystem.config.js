module.exports = {
  apps: [
    {
      name: "lifeatether-engine",
      script: "npm",
      args: "start",
      cwd: "/var/www/leaderboard/lifeatether-engine",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3098,
      },
      error_file: "/var/www/leaderboard/lifeatether-engine/logs/error.log",
      out_file: "/var/www/leaderboard/lifeatether-engine/logs/output.log",
      time: true,
    },
    {
      name: "lifeatether",
      script: "npm",
      args: "start",
      cwd: "/var/www/leaderboard/lifeatether",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3099,
      },
      error_file: "/var/www/leaderboard/lifeatether/logs/error.log",
      out_file: "/var/www/leaderboard/lifeatether/logs/output.log",
      time: true,
    },
  ],
};
