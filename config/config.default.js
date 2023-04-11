/* eslint valid-jsdoc: "off" */
'use strict';


/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.multipart = {
    mode: 'file',
    fileSize: 1048576000,
    whitelist: [ '.png', '.jpg', '.bmp', '.doc' ],
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1648288272516_5186';

  // add your middleware config here
  config.middleware = [];

  config.sequelize = {
    dialect: 'mysql',
    database: 'volleyball',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: 'root',
    timezone: '+08:00',
    exclude: 'index.js',
  };

  // 登录校验
  config.jwt = {
    secret: '123456',
    enable: true,
    ignore(ctx) {
      const paths = [ '/api/signIn', '/api/signUp', '/api/getSignUpCode' ];
      return paths.includes(ctx.path);
    },
  };

  config.passportLocal = {
    usernameField: 'accountId',
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    prefix: '/api',
  };

  return {
    ...config,
    userConfig,
  };
};