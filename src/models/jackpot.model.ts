import 'dotenv/config'
import { isNullOrEmpty, envErrorMessage } from '../common'
import mongoose, { Schema, Model } from "mongoose"

interface IJackpot {
  bonus: number
  date: string
}

const jackpotSchema = new Schema<IJackpot>({
  bonus: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})

if (isNullOrEmpty(process.env.COLLECTION_JOCKPOT)) {
  throw new Error(envErrorMessage)
}

const jackpot: Model<IJackpot> = mongoose.model(process.env.COLLECTION_JOCKPOT!, jackpotSchema)

export default jackpot