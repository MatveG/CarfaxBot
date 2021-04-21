import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const filePath = `./config.json`;
let config = {};

try {
  const data = fs.readFileSync(filePath, 'utf-8');
  const string = data.replace(/\${(\w+)\}/gm, (group, symbol) => process.env[symbol]);
  config = JSON.parse(string);
} catch (err) {
  throw err;
}

export default config;
