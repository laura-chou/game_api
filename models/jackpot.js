import 'dotenv/config'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const jackpotSchema = new Schema({
  bonus: {
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

const jackpot = mongoose.model(process.env.COLLECTION_JOCKPOT, jackpotSchema)

export default jackpot
