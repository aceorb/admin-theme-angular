/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const appRoot = require('app-root-path');
const config = require('config');
const fs = require('fs');
const winston = require('winston');

const fileLogger = config.get('logger.file');
const consoleLogger = config.get('logger.console');
const logDir = `${appRoot}/${fileLogger.logDir}`;
const logFileUrl = `${logDir}/${fileLogger.logFile}`;

winston.addColors(winston.config.npm.colors);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: fileLogger.level,
      filename: logFileUrl,
      handleExceptions: true,
      json: true,
      maxsize: fileLogger.maxsize,
      maxFiles: fileLogger.maxFiles,
      colorize: false,
      timestamp: () => (new Date()).toLocaleString('en-US', { hour12: false }),
    }),
    new winston.transports.Console({
      level: consoleLogger.level,
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: () => (new Date()).toLocaleString('en-US', { hour12: false }),
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
