import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file'
import { isNullOrEmpty } from '../common'
const { combine, timestamp, printf } = winston.format

export const enum LogLevel {
  INFO = 'info',
  ERROR = 'error',
  WARN = 'warn'
}

interface DailyRotateFileOption {
  level: string,
  filename: string,
  datePattern: string,
  dirname: string,
  zippedArchive: boolean,
  maxSize: string,
  maxFiles: string
}

const formatSetting : winston.Logform.Format = combine(
  timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
  printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)
)

const getDailyRotateFile = (level: LogLevel, fileName: string): DailyRotateFileOption => {
  return {
    level: level,
    filename: `${fileName}.log`,
    datePattern: 'YYYY-MM-DD',
    dirname: 'logs/%DATE%/',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  }
}

const logger: winston.Logger = winston.createLogger({
  format: formatSetting,
  transports: [
    new DailyRotateFile(getDailyRotateFile(LogLevel.INFO, 'log')),
    new DailyRotateFile(getDailyRotateFile(LogLevel.ERROR, 'errorLog')),
    new winston.transports.Console()
  ]
})

export const setLog = (level: LogLevel, message: string, functionName: string = "") : void => {
  if (!isNullOrEmpty(functionName)) {
    message = `function ${functionName}: ${message}`
  }
  
  switch (level) {
    case LogLevel.INFO:
      logger.info(message)
      break
    case LogLevel.ERROR:
      logger.error(message)
      break
    case LogLevel.WARN:
      logger.warn(message)
      break
  }
}