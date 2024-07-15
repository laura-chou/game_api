import jackpot from '../models/jackpot.js'
import { getTotalPlayer } from './rescue-money.js'
import { getDate, sendResponse, isNullOrEmpty, isTypeBoolean } from '../js/common.js'

export const getJackPot = async (req, res) => {
  try {
    jackpot.find({}, '-_id -date')
      .then((result) => {
        if (result.length > 0) {
          res.status(200).send(result[0].bonus.toString())
          return
        }
        res.status(200).send('0')
      })
      .catch((error) => {
        sendResponse(res, 500, false, error.message)
      })
  } catch (error) {
    sendResponse(res, 500, false, 'server error')
  }
}

export const updateJackPot = async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    sendResponse(res, 400, false, 'incorrect http header content-type')
    return
  }
  if (isNullOrEmpty(req.body.win)) {
    sendResponse(res, 400, false, 'json objects incorrect')
    return
  }
  if (!isTypeBoolean(req.body.win)) {
    sendResponse(res, 400, false, 'win is not a boolean.')
    return
  }
  try {
    const bonus = await getBonus()
    const totalPlayer = await getTotalPlayer()
    let updateBonus = 888888
    if (!req.body.win && bonus !== 0) {
      updateBonus = bonus * totalPlayer
    }
    const data = {
      bonus: updateBonus,
      date: getDate()
    }
    await jackpot.updateOne({}, data, { new: true })
      .then(() => {
        res.status(200).send(updateBonus.toString())
      })
      .catch((error) => {
        console.log(error.message)
        sendResponse(res, 500, false, error.message)
      })
  } catch (error) {
    sendResponse(res, 500, false, 'server error')
  }
}

const getBonus = async () => {
  let bonus = 0

  await jackpot.find()
    .then((result) => {
      if (result.length > 0) {
        bonus = result[0].bonus
      }
    })

  return bonus
}
