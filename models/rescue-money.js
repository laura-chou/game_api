import mongoose from 'mongoose'
import 'dotenv/config'

const Schema = mongoose.Schema

const rescueMoneySchema = new Schema({
  player: {
    type: String,
    require: true
  },
  money: {
    type: Number,
    require: true
  },
  date: {
    type: String,
    require: true
  }
}, {
  versionKey: false
})

const rescueMoney = mongoose.model(process.env.COLLECTION_RESCUEMONEY, rescueMoneySchema)

export default rescueMoney
