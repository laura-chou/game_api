import { Request, Response } from "express"
import { LogLevel, setLog } from "../logger"
import { getNowDate, isNullOrEmpty, isTypeBoolean, responseHandler, responseMessage } from "../common"
import jackpot from "../models/jackpot.model"

class JackpotController {
  private async getBonus(): Promise<number> {
    try {
      const result = await jackpot.findOne({}, "-_id -date")
      setLog(LogLevel.INFO, "success", this.getBonus.name)
      return result?.bonus ?? 0
    } catch (error) {
      setLog(LogLevel.ERROR, error instanceof Error ? error.message : "Unknown error", this.getBonus.name)
      throw error
    }
  }

  public getJackPot = Object.defineProperty(
    async (request: Request, response: Response) => {
      try {
        const data: number = await this.getBonus()
        setLog(LogLevel.INFO, "success", this.getJackPot.name)
        if (data > 0) {
          responseHandler.success(response, data.toString(), false)
          return
        }
        responseHandler.noData(response)
      } catch (error) {
        setLog(LogLevel.ERROR, error instanceof Error ? error.message : "Unknown error", this.getJackPot.name)
        responseHandler.serverError(response)
      }
    },
    "name",
    { value: "getJackPot" }
  )

  updateJackPot = Object.defineProperty(
    async (request: Request, response: Response) => {
      try {
        const contentType: string | undefined = request.headers["content-type"]
        if (contentType !== "application/json") {
          setLog(LogLevel.ERROR, responseMessage.INVALID_CONTENT_TYPE, this.updateJackPot.name)
          responseHandler.badRequest(response, "CONTENT_TYPE")
          return
        }
        if (isNullOrEmpty(request.body.win)) {
          setLog(LogLevel.ERROR, responseMessage.INVALID_JSON_KEY, this.updateJackPot.name) 
          responseHandler.badRequest(response, "JSON_KEY")
          return
        }
        if (!isTypeBoolean(request.body.win)) {
          setLog(LogLevel.ERROR, responseMessage.INVALID_JSON_FORMAT, this.updateJackPot.name)
          responseHandler.badRequest(response, "JSON_FORMAT")
          return
        }
        const bonus: number = await this.getBonus()
        // const totalPeople: number = await getTotalPlayers()
        const totalPeople: number = 10
        let updateBonus: number = 888888
        if (!request.body.win && bonus !== 0) {
          updateBonus = bonus * totalPeople
        }
        const data = {
          bonus: updateBonus,
          date: getNowDate()
        }
        await jackpot.updateOne({}, data, { new: true })
        setLog(LogLevel.INFO, "success", this.updateJackPot.name)
        responseHandler.success(response, updateBonus.toString(), false)
      } catch (error) {
        setLog(LogLevel.ERROR, error instanceof Error ? error.message : "Unknown error", this.updateJackPot.name)
        responseHandler.serverError(response)
      }
    },
    "name",
    { value: "updateJackPot" }
  )
}
  
export default JackpotController
  