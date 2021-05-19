import nedb from '../loaders/nedb';
import logger from '../loaders/logger';

// status:
// default - 0
// paid - 1
// submitted - 2
// downloaded - 3

export const insertOrder = (chatId, sum, vin, translate = false, contacts = {}) => {
  const order = {
    chatId,
    sum,
    vin,
    translate,
    contacts,
    status: 0,
    attempts: 0,
    created: Date.now(),
    updated: Date.now(),
  };

  return new Promise((resolve) => {
    nedb.insert(order, (error, row) => {
      if (error) {
        logger.error('Failed to insert in the DB', error);
        return resolve();
      }
      resolve(row._id);
    });
  });
};

export const updateOrder = (id, updates) => {
  return new Promise((resolve) => {
    nedb.update({_id: id}, {$set: updates}, {}, (error, count) => {
      if (error) {
        logger.error('Failed to update the DB', error);
        return resolve();
      }
      resolve(count);
    });
  });
};

export const removeOrder = (id) => {
  return new Promise((resolve) => {
    nedb.remove({_id: id}, {}, (error, count) => {
      if (error) {
        logger.error('Failed to remove from the DB', error);
        return resolve();
      }
      resolve(count);
    });
  });
};

export const findOrder = (id) => {
  return new Promise((resolve) => {
    nedb.find({_id: id}, (error, rows) => {
      if (error) {
        logger.error('Failed to find in the DB', error);
        return resolve();
      }
      resolve(rows[0]);
    });
  });
};

export const selectOrders = (where) => {
  return new Promise((resolve) => {
    nedb.find(where, (error, rows) => {
      if (error) {
        logger.error('Failed to find in the DB', error);
        return resolve([]);
      }
      resolve(rows);
    });
  });
};
