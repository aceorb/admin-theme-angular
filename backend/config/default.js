/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

module.exports = {

  api: {
    port: 3001,
    root: '/api',
  },

  frontEnd: {
    domain: 'http://localhost:4200',
  },

  auth: {
    jwt: {
      accessTokenSecret: '0d7c5c5f-768c-4d98-8900-13aadaa21937',
      refreshTokenSecret: '1a7v8c0l-391k-1f82-4492-tha3taa11334',
      accessTokenLife: 3600,
      refreshTokenLife: 2592000,
    },
    resetPassword: {
      secret: '56gXxY{+D6/4m#kZ394j2=bT2eHqTAu>r8zAT>yEn:;TM#9*Vg',
      ttl: 86400 * 1000, // 1 day
      algorithm: 'aes256',
      inputEncoding: 'utf8',
      outputEncoding: 'hex',
    },
  },

  db: {
    url: 'mongodb://localhost:27017/bundle-node',
    name: 'bundle-node',
  },

  logger: {
    console: {
      level: 'debug',
    },
    file: {
      logDir: 'logs',
      logFile: 'bundle_node.log',
      level: 'debug',
      maxsize: 1024 * 1024 * 10, // 10MB
      maxFiles: 5,
    },
  },
};
