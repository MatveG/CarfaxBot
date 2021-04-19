import Datastore from 'nedb';
import config from './config';

const nedb = new Datastore({
  filename: config.dbName,
});

nedb.loadDatabase();

export default nedb;
