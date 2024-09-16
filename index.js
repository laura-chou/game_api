import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rescueMoneyRoutes from './routes/rescue-money.js'
import jackpotRoutes from './routes/jackpot.js'
import indexRoutes from './routes/index.js'
import { sendResponse, isNullOrEmpty, convertToBool } from './js/common.js'
import { logger } from './js/logger.js'
import './db.js'

const app = express()
const whitelist = process.env.WHITELIST.split(',')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin (origin, callback) {
    if (whitelist.includes(origin) || convertToBool(process.env.ALLOW_CORS)) {
      logger.info(`origin: ${origin}`)
      callback(null, true)
    } else {
      const msg = 'Not allowed by CORS'
      logger.error(`origin: ${origin} ${msg}`)
      callback(new Error(msg), false)
    }
  },
  credentials: true
}))
app.use((error, req, res, next) => {
  if (!isNullOrEmpty(error.message)) {
    sendResponse(res, 403, 'error', 'CORS policy does not allow access from this origin.')
    return
  }
  logger.info(`Path: ${req.originalUrl}`)
  next()
})
app.use('/', indexRoutes)
app.use('/rescuemoney', rescueMoneyRoutes)
app.use('/jackpot', jackpotRoutes)

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`)
})
