import fs from 'fs';
import bot from '../loaders/bot';

export const sendBotDocument = (chatId, fileName, filePath) => {
  return bot.telegram.sendDocument(chatId,
      {
        source: fs.readFileSync(filePath),
        filename: fileName,
      },
  );
};

export const sendBotMessage = (chatId, message) => {
  return bot.telegram.sendMessage(chatId, message);
};
