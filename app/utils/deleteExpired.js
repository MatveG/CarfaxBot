import fs from 'fs';
import logger from '../loaders/logger';

export default (directory, expirationDays) => {
  fs.readdir(directory, (err, files) => {
    if (err) {
      return logger.error('Error reading download directory', err);
    }

    files.forEach((file) => {
      unlinkIfExpired(`${directory}/${file}`, expirationDays);
    });
  });
};

function unlinkIfExpired(filePath, expirationDays) {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      return logger.error('Error reading file', err);
    }
    const lastModDays = (Date.now() - stats.mtimeMs) / 1000 / 60 / 60 / 30;

    if (lastModDays > expirationDays) {
      unlinkFile(filePath);
    }
  });
};

function unlinkFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      logger.error('Error deleting file', err);
    }
  });
};
