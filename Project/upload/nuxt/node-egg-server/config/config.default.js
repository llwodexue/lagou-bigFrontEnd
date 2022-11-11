/* eslint valid-jsdoc: "off" */

'use strict'
const path = require('path')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1593865922333_8921'

  // add your middleware config here
  config.middleware = []

  // 打开文件上传
  config.multipart = {
    mode: 'file',
    // 文件白名单, 返回 true 表示任何文件都可以上传
    whitelist: () => true,
    fileSize: 655360000000
  }

  // 自定义文件上传的路径
  config.uploadDir = path.resolve(__dirname, '..', 'app/public')

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: {
        enable: false
        //headerName:'Authorization'
      }
    },
    mongoose: {
      url: 'mongodb://127.0.0.1:27017/nuxthub',
      options: {
        // useMongoClient: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        bufferMaxEntries: 0
      }
    },
    jwt: {
      secret: '@:hope*&HGF~!'
    }
  }
}
