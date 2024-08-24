import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { convertToBool } from './common.js'
const { combine, timestamp, colorize, printf } = winston.format

const formatSetting = convertToBool(process.env.RELEASE)
  ? combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
    printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)
  )
  : combine(
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
    printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)
  )

const getDailyRotateFile = (level, fileName) => {
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

export const logger = winston.createLogger({
  format: formatSetting,
  transports: [
    new DailyRotateFile(getDailyRotateFile('info', 'log')),
    new DailyRotateFile(getDailyRotateFile('error', 'errorLog')),
    new winston.transports.Console()
  ]
})

export const logFunctionMsg = (name, message) => {
  return `function ${name}: ${message}`
}
