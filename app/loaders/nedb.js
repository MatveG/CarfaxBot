import Datastore from 'nedb';
import config from './config';
import logger from './logger';

const nedb = {
  users: new Datastore(config.usersDb),
  orders: new Datastore(config.ordersDb),
};

nedb.users.loadDatabase();
nedb.orders.loadDatabase();

nedb.users.ensureIndex({fieldName: 'chatId', unique: true}, (error) => {
  if (error) {
    logger.error('Error initialising DB', error);
  }
});
nedb.orders.ensureIndex({fieldName: 'status'}, (error) => {
  if (error) {
    logger.error('Error initialising DB', error);
  }
});

export default nedb;
