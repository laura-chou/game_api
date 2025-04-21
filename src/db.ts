import mongoose from 'mongoose'
import { LogLevel, setLog } from './logger'
import { isNullOrEmpty, responseMessage } from './common'

if (isNullOrEmpty(process.env.DBURL)) {
  throw new Error(responseMessage.ENV_ERROR)
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
mongoose.connect(process.env.DBURL!)
  .then(() => {
    setLog(LogLevel.INFO, 'MongoDB connected successfully')
  })
  .catch((error) => {
    setLog(LogLevel.ERROR, `MongoDB connection error: ${error.message}`)
    process.exit(1)
  })