import dotenv from 'dotenv'
import mongoose from 'mongoose'
import beautifyUnique from 'mongoose-beautiful-unique-validation'

dotenv.config()

const Schema = mongoose.Schema
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
mongoose.plugin(beautifyUnique)

const rescuemoneySchema = new Schema({
  player: {
    type: String,
    require: [true, '玩家名稱必填'],
    unique: '名稱重複'
  },
  money: {
    type: Number,
    require: [true, '金錢必填']
  }
}, {
  versionKey: false
})

const bonusSchema = new Schema({
  jackpot: {
    type: Number,
    require: [true, '獎金必填']
  }
}, {
  versionKey: false
})

const turnchessSchema = new Schema({
  player: {
    type: String,
    require: [true, '玩家名稱必填'],
    unique: '名稱重複'
  },
  spend: {
    type: String,
    require: [true, '花費時間必填']
  }
}, {
  versionKey: false
})

const hitzombiesSchema = new Schema({
  player: {
    type: String,
    require: [true, '玩家名稱必填'],
    unique: '名稱重複'
  },
  spend: {
    type: String,
    require: [true, '花費時間必填']
  }
}, {
  versionKey: false
})

const rescuemoney = mongoose.model(process.env.COLLECTION_RESCUEMONEY, rescuemoneySchema)
const bonus = mongoose.model(process.env.COLLECTION_BONUS, bonusSchema)
const turnchess = mongoose.model(process.env.COLLECTION_TURNCHESS, turnchessSchema)
const hitzombies = mongoose.model(process.env.COLLECTION_HITZOMBIES, hitzombiesSchema)
const connection = mongoose.connection

export default {
  rescuemoney,
  bonus,
  turnchess,
  hitzombies,
  connection
}
