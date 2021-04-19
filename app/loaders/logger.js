import winston from 'winston';

const {createLogger, format, transports} = winston;
const {combine, timestamp, json, splat, prettyPrint} = format;
const production = process.env.NODE_ENV === 'production';


const logger = createLogger({
  format: combine(
      json(),
      splat(),
      prettyPrint(),
      timestamp({format: 'DD-MM-YY HH:mm:ss'}),
  ),
  transports: production ?
    [new transports.File({filename: 'logger.log', level: 'error'})] :
    [new transports.Console({level: 'debug'})],
});

export default logger;
