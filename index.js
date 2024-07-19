import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rescueMoneyRoutes from './routes/rescue-money.js'
import jackpotRoutes from './routes/jackpot.js'
import indexRoutes from './routes/index.js'
import './db.js'

dotenv.config()

const app = express()
const whitelist = process.env.WHITELIST.split(',')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin (origin, callback) {
    if (process.env.ALLOW_CORS === 'true') {
      callback(null, true)
    } else if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed'), false)
    }
  },
  credentials: true
}))

app.use('/', indexRoutes)
app.use('/rescuemoney', rescueMoneyRoutes)
app.use('/jackpot', jackpotRoutes)

app.listen(process.env.PORT, () => {
  console.log('http://localhost:3000')
})
