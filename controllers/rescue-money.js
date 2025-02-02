import rescueMoney from '../models/rescue-money.js'
import {
  getNowDate, sendResponse,
  isNullOrEmpty, isTypeString,
  serverRes, contentTypeRes, jsonKeyRes, jsonValueRes, noDataRes
} from '../js/common.js'
import { logger, logFunctionMsg } from '../js/logger.js'

const getPlayersData = () => {
  return new Promise((resolve, reject) => {
    rescueMoney.find({}, '-_id -date')
      .sort({ money: 'desc' })
      .then(result => {
        logger.info(logFunctionMsg(getPlayersData.name, 'success'))
        resolve(result)
      })
      .catch(error => {
        logger.error(logFunctionMsg(getPlayersData.name, error.message))
        resolve([])
      })
  })
}

export const getTotalPlayers = () => {
  return new Promise((resolve, reject) => {
    rescueMoney.distinct('player')
      .then(totalPlayer => {
        logger.info(logFunctionMsg(getTotalPlayers.name, 'success'))
        resolve(totalPlayer.length)
      })
      .catch(error => {
        logger.error(logFunctionMsg(getTotalPlayers.name, error.message))
        resolve(0)
      })
  })
}

export const insertPlayer = async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    logger.error(logFunctionMsg(insertPlayer.name, contentTypeRes.message))
    sendResponse(res, contentTypeRes.statusCode, 'error', contentTypeRes.message)
    return
  }
  if (isNullOrEmpty(req.body.player) || isNullOrEmpty(req.body.money)) {
    logger.error(logFunctionMsg(insertPlayer.name, jsonKeyRes.message))
    sendResponse(res, jsonKeyRes.statusCode, 'error', jsonKeyRes.message)
    return
  }
  if (!isTypeString(req.body.player) || !isTypeString(req.body.money)) {
    const msg = `${jsonValueRes.message} Expected string.`
    logger.error(logFunctionMsg(insertPlayer.name, msg))
    sendResponse(res, jsonValueRes.statusCode, 'error', msg)
    return
  }
  try {
    const insertData = {
      player: req.body.player,
      money: req.body.money,
      date: getNowDate()
    }
    rescueMoney.create(insertData)
      .then(async () => {
        logger.info(logFunctionMsg(insertPlayer.name, 'success'))
        let data = await getPlayersData()
        if (data.length > 0) {
          data = getResultData(data).slice(0, 5)
        }
        const isPlayerInTop5 = data.some(item => item.players.includes(req.body.player))
        res.status(200).send({
          status: 'success',
          message: '',
          topFive: isPlayerInTop5
        })
      })
      .catch((error) => {
        logger.error(logFunctionMsg(insertPlayer.name, error.message))
        sendResponse(res, serverRes.statusCode, 'error', serverRes.message)
      })
  } catch (error) {
    logger.error(logFunctionMsg(insertPlayer.name, error.message))
    sendResponse(res, serverRes.statusCode, 'error', serverRes.message)
  }
}

export const getPlayers = async (req, res) => {
  try {
    const data = await getPlayersData()
    logger.info(logFunctionMsg(getPlayers.name, 'success'))
    if (data.length > 0) {
      sendResponse(res, 200, 'success', '', getResultData(data))
      return
    }
    sendResponse(res, 200, 'success', noDataRes.message)
  } catch (error) {
    logger.error(logFunctionMsg(getPlayers.name, error.message))
    sendResponse(res, serverRes.statusCode, 'error', serverRes.message)
  }
}

export const getTopFive = async (req, res) => {
  try {
    const data = await getPlayersData()
    logger.info(logFunctionMsg(getTopFive.name, 'success'))
    if (data.length > 0) {
      const topFive = getResultData(data).slice(0, 5)
      sendResponse(res, 200, 'success', '', topFive)
      return
    }
    sendResponse(res, 200, 'success', noDataRes.message)
  } catch (error) {
    logger.error(logFunctionMsg(getTopFive.name, error.message))
    sendResponse(res, serverRes.statusCode, 'error', serverRes.message)
  }
}

export const getTotalPlayer = async () => {
  try {
    const totalPlayer = await rescueMoney.distinct('player')
    logger.info(logFunctionMsg(getTotalPlayer.name, 'success'))
    return totalPlayer.length
  } catch (error) {
    logger.error(logFunctionMsg(getTotalPlayer.name, error.message))
    return 0
  }
}

const getResultData = (data) => {
  const sequence = data.reduce((res, current) => {
    const result = res.find(e => e.money === current.money)
    if (result) {
      result.players = [...result.players, current.player]
      return res
    } else {
      return [...res, {
        money: current.money,
        players: [current.player]
      }]
    }
  }, [])

  sequence.sort((a, b) => {
    return parseFloat(b.money) - parseFloat(a.money)
  })

  sequence.forEach((item, index) => {
    item.rank = index + 1
  })

  return sequence
}
