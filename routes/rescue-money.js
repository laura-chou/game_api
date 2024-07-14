import express from 'express'
import { insertPlayer, getPlayers, getTopFive } from '../controllers/rescue-money.js'

const router = express.Router()

router.get('/', getPlayers)
router.get('/top5', getTopFive)
router.post('/add', insertPlayer)

export default router
