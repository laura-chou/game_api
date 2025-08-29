import { Request, Response } from "express";

import { responseHandler } from "../common/response";
import { getNowDate, setFunctionName } from "../common/utils";
import { setLog, LogLevel, LogMessage } from "../core/logger";
import Jackpot from "../models/jackpot.model";

import * as baseController from "./base.controller";
import * as rescueMoneyController from "./rescueMoney.controller";

const getBonus = setFunctionName(
  async(): Promise<number> => {
      try {
        const result = await Jackpot.findOne({}, "-_id -date").lean();
        if (!result) {
          throw new Error("No jackpot data found");
        }
        setLog(LogLevel.INFO, LogMessage.SUCCESS, getBonus.name);
        return result?.bonus;
    } catch (error) {
      setLog(
        LogLevel.ERROR,
        error instanceof Error ? error.message : LogMessage.ERROR.UNKNOWN,
        getBonus.name);
      throw error;
    }
  }, 
  "getBonus"
);

export const getJackPot = setFunctionName(
  async(_: Request, response: Response): Promise<void> => {
    try {
      const data = await getBonus();
      setLog(LogLevel.INFO, LogMessage.SUCCESS, getJackPot.name);
      responseHandler.success(response, data, false);
    } catch (error) {
      baseController.errorHandler(response, error, getJackPot.name);
    }
  },
  "getJackPot"
);

export const updateJackPot = setFunctionName(
  async(request: Request, response: Response): Promise<void> => {
    try {
      if (!baseController.validateContentType(request, response, updateJackPot.name)) {
        return;
      }
      const fields = [
        { key: "win", type: "boolean" }
      ];
      if (!baseController.validateBodyFields(request, response, updateJackPot.name, fields)) {
        return;
      }

      const bonus = await getBonus();
      const totalPlayers = await rescueMoneyController.getTotalPlayers();
      let updateBonus = 888888;
      if (!request.body.win) {
        updateBonus = bonus * totalPlayers;
      }
      const data = {
        bonus: updateBonus,
        date: getNowDate()
      };
      await Jackpot.updateOne({}, data);
      setLog(LogLevel.INFO, LogMessage.SUCCESS, updateJackPot.name);
      responseHandler.success(response, updateBonus.toString(), false);
    } catch (error) {
      baseController.errorHandler(response, error, updateJackPot.name);
    }
  },
  "updateJackPot"
);