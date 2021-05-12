import fs from 'fs';
import logger from './logger';

let config;

try {
  config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
} catch (error) {
  logger.error('Error parsing config.json', error);
  throw error;
}

export default config;
