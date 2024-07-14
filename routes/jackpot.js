import express from 'express'
import { getJackPot, updateJackPot } from '../controllers/jackpot.js'

const router = express.Router()

router.get('/', getJackPot)
router.patch('/update', updateJackPot)

export default router
