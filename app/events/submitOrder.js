import nedb from '../loaders/nedb';

export default (vin, translate, chatId) => {
  nedb.insert({
    vin,
    translate,
    chatId,
    submitted: false,
    downloaded: false,
    attempts: 0,
    created: Date.now(),
  });
};
