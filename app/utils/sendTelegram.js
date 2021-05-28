import fs from 'fs';
import bot from '../loaders/bot';
import {remove, select} from './nedbOrm';

export const sendMessage = (chatId, message) => {
  return bot.telegram.sendMessage(chatId, message);
};

export const sendDocument = (chatId, fileName, filePath) => {
  return bot.telegram.sendDocument(chatId,
      {
        source: fs.readFileSync(filePath),
        filename: fileName,
      },
  );
};

export const sendPhoto = (chatId, photoFileId, messageText = '') => {
  return bot.telegram.sendPhoto(
      chatId,
      photoFileId,
      {
        caption: messageText,
        parse_mode: 'Markdown',
      },
  );
};

export const sendToAllUsers = async (messageText, photoId = null) => {
  let counter = 0;

  for (const {_id, chatId} of await select('users', {})) {
    if (counter % 20 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    try {
      photoId ?
        await sendPhoto(chatId, photoId, messageText) :
        await sendMessage(chatId, messageText);
      counter++;
    } catch (error) {
      await remove('users', _id);
    }
  }

  return counter;
};
