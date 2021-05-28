import nedb from '../loaders/nedb';
import logger from '../loaders/logger';

export class Order {
  constructor(chatId, locale, sum, vin, translate = false, contacts = {}) {
    Object.assign(this, {chatId, locale, sum, vin, translate, contacts});
    this.status = 0;
    this.attempts = 0;
    this.created = Date.now();
    this.paid = Date.now();
  }
}

export class User {
  constructor(chatId, username) {
    Object.assign(this, {chatId, username});
    this.created = Date.now();
  }
}

export const insert = (table, document) => {
  return new Promise((resolve) => {
    nedb[table].insert(document, (error, row) => {
      if (error) {
        logger.error('Failed to insert in the DB', error);
        return resolve();
      }
      resolve(row._id);
    });
  });
};

export const update = (table, where, updates) => {
  return new Promise((resolve) => {
    nedb[table].update(where, {$set: updates}, {multi: true}, (error, count) => {
      if (error) {
        logger.error('Failed to update the DB', error);
        return resolve();
      }
      resolve(count);
    });
  });
};

export const select = (table, where) => {
  return new Promise((resolve) => {
    nedb[table].find(where, (error, rows) => {
      if (error) {
        logger.error('Failed to find in the DB', error);
        return resolve([]);
      }
      resolve(rows);
    });
  });
};

export const find = (table, id) => {
  return new Promise((resolve) => {
    nedb[table].find({_id: id}, (error, rows) => {
      if (error) {
        logger.error('Failed to find in the DB', error);
        return resolve();
      }
      resolve(rows[0]);
    });
  });
};

export const remove = (table, id) => {
  return new Promise((resolve) => {
    nedb[table].remove({_id: id}, {}, (error, count) => {
      if (error) {
        logger.error('Failed to remove from the DB', error);
        return resolve();
      }
      resolve(count);
    });
  });
};
