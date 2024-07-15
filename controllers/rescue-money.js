import rescueMoney from '../models/rescue-money.js'
import { getDate, sendResponse, isNullOrEmpty, isTypeString, isTypeInteger } from '../js/common.js'

export const insertPlayer = async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    sendResponse(res, 400, false, 'incorrect http header content-type')
    return
  }
  if (isNullOrEmpty(req.body.player) || isNullOrEmpty(req.body.money)) {
    sendResponse(res, 400, false, 'json objects incorrect')
    return
  }
  if (!isTypeString(req.body.player)) {
    sendResponse(res, 400, false, 'player is not a string')
    return
  }
  if (!isTypeInteger(req.body.money)) {
    sendResponse(res, 400, false, 'money is not a number')
    return
  }
  try {
    rescueMoney.find()
      .sort(({ money: 'desc' }))
      .then((result) => {
        const data = {
          player: req.body.player,
          money: req.body.money,
          date: getDate()
        }
        rescueMoney.create(data)
          .then(() => {
            rescueMoney.find()
              .sort(({ money: 'desc' }))
              .limit(5)
              .then((result) => {
                const isTopFive = result.some(item => item.player === req.body.player)
                res.status(200).send({
                  success: true,
                  message: '',
                  topFive: isTopFive
                })
              })
              .catch((error) => {
                sendResponse(res, 500, false, error.message)
              })
          })
          .catch((error) => {
            sendResponse(res, 500, false, error.message)
          })
      })
      .catch((error) => {
        sendResponse(res, 500, false, error.message)
      })
  } catch (error) {
    sendResponse(res, 500, false, 'server error')
  }
}

export const getPlayers = async (req, res) => {
  try {
    rescueMoney.find({}, '-_id -date')
      .sort(({ money: 'desc' }))
      .then((result) => {
        if (result.length > 0) {
          sendResponse(res, 200, true, '', getResultData(result))
          return
        }
        sendResponse(res, 200, true, 'no data')
      })
      .catch((error) => {
        sendResponse(res, 500, false, error.message)
      })
  } catch (error) {
    sendResponse(res, 500, false, 'server error')
  }
}

export const getTopFive = async (req, res) => {
  try {
    rescueMoney.find({}, '-_id -date')
      .sort(({ money: 'desc', date: 'asc' }))
      .then((result) => {
        if (result.length > 0) {
          const data = getResultData(result).slice(0, 5)
          sendResponse(res, 200, true, '', data)
          return
        }
        sendResponse(res, 200, true, 'no data')
      })
      .catch((error) => {
        sendResponse(res, 500, false, error.message)
      })
  } catch (error) {
    sendResponse(res, 500, false, 'server error')
  }
}

export const getTotalPlayer = async () => {
  try {
    const totalPlayer = await rescueMoney.distinct('player')
    return totalPlayer.length
  } catch (error) {
    return 0
  }
}

const getResultData = (data) => {
  let index = 0
  return data.reduce((res, current) => {
    const result = res.find(e => e.money === current.money)
    if (result) {
      result.players = [...result.players, current.player]
      return res
    } else {
      index++
      return [...res, {
        rank: index,
        money: current.money,
        players: [current.player]
      }]
    }
  }, [])
}
