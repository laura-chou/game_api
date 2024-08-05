
import jackpot from '../models/jackpot.js'
import { getTotalPlayers } from './rescue-money.js'
import {
  nowDate, sendResponse,
  isNullOrEmpty, isTypeBoolean,
  serverRes, contentTypeRes, jsonKeyRes, jsonValueRes, noDataRes
} from '../js/common.js'
import { logger, logFunctionMsg } from '../js/logger.js'

const getBonus = () => {
  return new Promise((resolve, reject) => {
    jackpot.findOne({}, '-_id -date')
      .then(result => {
        logger.info(logFunctionMsg(getBonus.name, 'success'))
        resolve(result.bonus)
      })
      .catch(error => {
        logger.error(logFunctionMsg(getBonus.name, error.message))
        resolve(0)
      })
  })
}

export const getJackPot = async (req, res) => {
  try {
    const data = await getBonus()
    logger.info(logFunctionMsg(getJackPot.name, 'success'))
    if (data > 0) {
      res.status(200).send(data.toString())
      return
    }
    sendResponse(res, 200, 'success', noDataRes.message)
  } catch (error) {
    logger.error(logFunctionMsg(getJackPot.name, error.message))
    sendResponse(res, serverRes.statusCode, 'error', serverRes.message)
  }
}

export const updateJackPot = async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    logger.error(logFunctionMsg(updateJackPot.name, contentTypeRes.message))
    sendResponse(res, contentTypeRes.statusCode, 'error', contentTypeRes.message)
    return
  }
  if (isNullOrEmpty(req.body.win)) {
    logger.error(logFunctionMsg(updateJackPot.name, jsonKeyRes.message))
    sendResponse(res, jsonKeyRes.statusCode, 'error', jsonKeyRes.message)
    return
  }
  if (!isTypeBoolean(req.body.win)) {
    const msg = `${jsonValueRes.message} Expected boolean.`
    logger.error(logFunctionMsg(updateJackPot.name, msg))
    sendResponse(res, jsonValueRes.statusCode, 'error', msg)
    return
  }
  try {
    const bonus = await getBonus()
    const totalPeople = await getTotalPlayers()
    let updateBonus = 888888
    if (!req.body.win && bonus !== 0) {
      updateBonus = bonus * totalPeople
    }
    const data = {
      bonus: updateBonus,
      date: nowDate
    }
    await jackpot.updateOne({}, data, { new: true })
      .then(() => {
        logger.info(logFunctionMsg(updateJackPot.name, 'success'))
        res.status(200).send(updateBonus.toString())
      })
      .catch((error) => {
        logger.error(logFunctionMsg(updateJackPot.name, error.message))
        sendResponse(res, serverRes.statusCode, 'error', serverRes.message)
      })
  } catch (error) {
    logger.error(logFunctionMsg(updateJackPot.name, error.message))
    sendResponse(res, serverRes.statusCode, 'error', serverRes.message)
  }
}
