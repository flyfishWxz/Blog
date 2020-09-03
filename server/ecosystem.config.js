module.exports = {
  apps : [{
    name:'blog',
    script: './bin/www',
    instances:1,
    autorestart:true,
    watch: true,
    ignore_watch:[//不监听某文件
      "node_modules",
      "logs"
    ],
    "error_file":"./logs/blog—err.log",//错误日志文件
    "out_file":"./logs/blog-out.log",
    max_memory_restart:'1G',
    env:{
      NODE_ENV:'development'
    },
    env_production:{
      NODE_ENV:'production'
    }
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
