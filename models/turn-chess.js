import 'dotenv/config'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const turnchessSchema = new Schema({
  player: {
    type: String,
    require: true
  },
  spend: {
    type: String,
    require: true
  },
  date: {
    type: String,
    require: true
  }
}, {
  versionKey: false
})

const turnchess = mongoose.model(process.env.COLLECTION_TURNCHESS, turnchessSchema)

export default { turnchess }
