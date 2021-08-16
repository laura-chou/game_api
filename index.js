import express from 'express'
// import bodyParser from 'body-parser'
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
      if (!err && rescuemoney.length > 0) {
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
          const result = await db.rescuemoney.create(
            {
              player: req.body.player,
              money: req.body.money
            }
          )
          console.log(result)
          res.status(200)
          res.send({ success: true, message: '' })
        }
      } else {
        res.status(400)
        res.send({ success: false, message: '資料庫沒有資料' })
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
    // 找不到東西
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
    // 找不到東西
    res.status(404)
    res.send({ success: false, message: '找不到' })
  }
})

app.listen(process.env.PORT, () => {
  console.log('網頁伺服器已啟動')
  console.log('http://localhost:3000')
})
