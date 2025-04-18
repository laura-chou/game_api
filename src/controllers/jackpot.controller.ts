import { Request, Response } from "express"
import { LogLevel, setLog } from '../logger'
import { noDataRes } from "../common"
import jackpot from "../models/jackpot.model"


const getBonus = () : Promise<number> => {
  return new Promise((resolve, reject) => {
    jackpot.findOne({}, '-_id -date')
      .then(result => {
        setLog(LogLevel.INFO, "success", getBonus.name)
        resolve(result?.bonus || 0)
      })
      .catch(error => {
        setLog(LogLevel.ERROR, error.message, getBonus.name)
        resolve(0)
      })
  })
}

class JackpotController {
  getJackPot = async (request: Request, response: Response) => {
    const data = await getBonus()
    setLog(LogLevel.INFO, "success", this.getJackPot.name)
    if (data > 0) {
      response.status(200).send(data.toString())
      return
    }
    response.status(noDataRes.statusCode).send(noDataRes.message)
  }
}
  
export default JackpotController
  