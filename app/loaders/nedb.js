import Datastore from 'nedb';
import config from './config';

const nedb = {
  users: new Datastore(config.usersDb),
  orders: new Datastore(config.ordersDb),
};

nedb.users.loadDatabase();
nedb.orders.loadDatabase();

export default nedb;
