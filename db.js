import 'dotenv/config'
import mongoose from 'mongoose'

mongoose.connect(process.env.DBURL)
