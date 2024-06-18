/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const { ObjectID } = require('mongodb');
const getMongoDBClient = require('../db/mongodbClient');

class BaseRepository {
  constructor(collectionName) {
    this.dbClient = getMongoDBClient();
    this.collection = collectionName;
  }

  getCount() {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .countDocuments());
  }

  getCountFiltered(filter = {}) {
    return this.dbClient
      .then(db => {
        // filtering here
        return db.collection(this.collection).countDocuments(filter.query);
      });
  }

  findById(id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .findOne({ _id: ObjectID(id) }));
  }

  add(item) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .insertOne(item));
  }

  addMany(items) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .insertMany(items));
  }

  edit(id, item) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .updateOne({ _id: ObjectID(id) }, { $set: item }, { upsert: true }));
  }

  delete(id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .remove({ _id: ObjectID(id) }));
  }

  list() {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .find());
  }

  listFiltered(filter) {
    return this.dbClient
      .then(db => {
        const data = db.collection(this.collection)
          .find(filter.query || {}).sort({_id: -1});

        if (filter.pageSize && filter.pageNumber) {
          data
            .skip(parseInt(filter.pageSize, 10) * (parseInt(filter.pageNumber, 10) - 1))
            .limit(parseInt(filter.pageSize, 10));
        }

          if (filter.sortBy && filter.orderBy) {
            const sortSettings = { [filter.sortBy]: filter.orderBy === 'ASC' ? 1 : -1 };

            data.collation({ locale: 'en' }).sort(sortSettings);
          }

        return data.toArray();
      });
  }
}

module.exports = BaseRepository;
