/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const mongoClient = require('mongodb').MongoClient;
const config = require('config');
const logger = require('../utils/logger');

let dbClient = null;

module.exports = function getMongoDBClient() {
  if (dbClient) {
    return dbClient;
  }
  logger.info('Connecting to MongoDB client...');

  const { url, name } = config.get('db');
  dbClient = mongoClient.connect(url, { useNewUrlParser: true })
    .then(client => {
      logger.info('MongoDB client has been successfully created');

      return client.db(name);
    })
    .catch(err => {
      logger.error(`Error occurred while connecting to mongodb: ${err}`);
    });

  return dbClient;
};
