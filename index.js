import express from 'express'
import cors from 'cors'
import db from './db.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin (origin, callback) {
    if (origin === undefined) {
      callback(null, true)
    } else {
      if (process.env.ALLOW_CORS === 'true') {
        // 開發環境，允許
        callback(null, true)
      } else if (origin.includes('github')) {
        // 非開發環境，但是從 github 過來，允許
        callback(null, true)
      } else {
        // 不是開發也不是從 github 過來，拒絕
        callback(new Error('Not allowed'), false)
      }
    }
  },
  credentials: true
}))
/* RescueMoney */
// 新增
app.post('/RescueMoney/add', async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400)
    res.send({ success: false, message: '格式不符' })
    return
  }
  if (req.body.player === undefined || req.body.money === undefined) {
    res.status(400)
    res.send({ success: false, message: '欄位不正確' })
    return
  }
  try {
    // 檢查名稱是否重複
    db.rescuemoney.find({}, { _id: 0 }, async function (err, rescuemoney) {
      if (!err) {
        let exist = false
        for (let i = 0; i < rescuemoney.length; i++) {
          if (rescuemoney[i].player === req.body.player) {
            exist = true
            break
          }
        }
        if (exist) {
          res.status(200)
          res.send({ success: false, message: '名稱重複' })
        } else {
          // 新增
          await db.rescuemoney.create(
            {
              player: req.body.player,
              money: req.body.money
            }
          )
          res.status(200)
          res.send({ success: true, message: '' })
        }
      }
    })
  } catch (error) {
    const key = Object.keys(error.errors)[0]
    const message = error.errors[key].message
    res.status(400)
    res.send({ success: false, message })
  }
})
// 查詢
app.get('/RescueMoney/SearchAll', async (req, res) => {
  try {
    db.rescuemoney.find({}, { _id: 0 }, function (err, rescuemoney) {
      if (!err && rescuemoney.length > 0) {
        rescuemoney.sort(function (a, b) {
          return b.money - a.money
        })
        res.status(200)
        res.send({ success: true, message: '所有資料', rescuemoney })
      } else {
        res.status(400)
        res.send({ success: false, message: '資料庫沒有資料' })
      }
    })
  } catch (error) {
    res.status(404)
    res.send({ success: false, message: '找不到' })
  }
})
// 查詢 player
app.get('/RescueMoney/Search/:player', async (req, res) => {
  try {
    db.rescuemoney.find({}, { _id: 0 }, function (err, rescuemoney) {
      if (!err && rescuemoney.length > 0) {
        rescuemoney.sort(function (a, b) {
          return b.money - a.money
        })
        try {
          const findPlayer = rescuemoney => rescuemoney.player === req.params.player
          const index = rescuemoney.findIndex(findPlayer)
          rescuemoney = [{
            player: rescuemoney[index].player,
            money: rescuemoney[index].money,
            rank: index + 1
          }]
          res.status(200)
          res.send({ success: true, message: '', rescuemoney })
        } catch (error) {
          res.status(404)
          res.send({ success: false, message: '找不到資料' })
        }
      } else {
        res.status(400)
        res.send({ success: false, message: '資料庫沒有資料' })
      }
    })
  } catch (error) {
    res.status(404)
    res.send({ success: false, message: '找不到' })
  }
})
// 檢查是否為第一
app.get('/RescueMoney/IsTopFive/:player', async (req, res) => {
  try {
    db.rescuemoney.find({}, { _id: 0 }, function (err, rescuemoney) {
      if (!err && rescuemoney.length > 0) {
        rescuemoney.sort(function (a, b) {
          return b.money - a.money
        })
        try {
          res.status(200)
          let topFive = false
          for (let i = 0; i < 5; i++) {
            if (rescuemoney[i].player === req.params.player) {
              topFive = true
              break
            }
          }
          res.send({ success: true, message: topFive })
        } catch (error) {
          res.status(404)
          res.send({ success: false, message: '找不到資料' })
        }
      } else {
        res.status(400)
        res.send({ success: false, message: '資料庫沒有資料' })
      }
    })
  } catch (error) {
    res.status(404)
    res.send({ success: false, message: '找不到' })
  }
})
/* Bonus */
// 查詢
app.get('/Bonus/SearchAll', async (req, res) => {
  try {
    let amount = 0
    db.rescuemoney.find({}, { _id: 0 }, function (err, rescuemoney) {
      if (!err) {
        amount = rescuemoney.length
        db.bonus.find({}, { _id: 0 }, function (err, bonus) {
          if (!err && bonus.length > 0) {
            res.status(200)
            const result = {
              jackpot: bonus[0].jackpot,
              amount: amount
            }
            res.send({ success: true, message: '所有資料', result })
          } else {
            res.status(400)
            res.send({ success: false, message: '資料庫沒有資料' })
          }
        })
      }
    })
  } catch (error) {
    res.status(404)
    res.send({ success: false, message: '找不到' })
  }
})
// 修改
app.patch('/Bonus/Update', async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400)
    res.send({ success: false, message: '格式不符' })
    return
  }
  if (req.body.jackpot === undefined) {
    res.status(400)
    res.send({ success: false, message: '更新欄位不符' })
    return
  } else if (isNaN(req.body.jackpot)) {
    res.status(400)
    res.send({ success: false, message: 'jackpot不是數字' })
    return
  }
  try {
    db.bonus.find({}, async function (err, bonus) {
      if (!err && bonus.length > 0) {
        await db.bonus.findByIdAndUpdate(bonus[0]._id, { jackpot: req.body.jackpot }, { new: true })
        res.status(200)
        res.send({ success: true, message: '修改成功' })
      } else {
        res.status(400)
        res.send({ success: false, message: '資料庫沒有資料' })
      }
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400)
      res.send({ success: false, message })
    } else {
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})
app.listen(process.env.PORT, () => {
  console.log('網頁伺服器已啟動')
  console.log('http://localhost:3000')
})
