import { Request, Response } from "express";

import { responseHandler } from "../common/response";
import { getNowDate, setFunctionName } from "../common/utils";
import { setLog, LogLevel, LogMessage } from "../core/logger";
import jackpot from "../models/jackpot.model";

import * as baseController from "./base.controller";
import * as rescueMoneyController from "./rescueMoney.controller";

const getBonus = setFunctionName(
  async(): Promise<number> => {
      try {
        const result = await jackpot.findOne({}, "-_id -date").lean();
        setLog(LogLevel.INFO, LogMessage.SUCCESS, getBonus.name);
        return result?.bonus ?? 0;
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
      const data: number = await getBonus();
      setLog(LogLevel.INFO, LogMessage.SUCCESS, getJackPot.name);
      if (data > 0) {
        responseHandler.success(response, data.toString(), false);
        return;
      }
      responseHandler.noData(response);
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

      const bonus: number = await getBonus();
      const totalPlayers: number = await rescueMoneyController.getTotalPlayers();
      let updateBonus: number = 888888;
      if (!request.body.win && bonus !== 0) {
        updateBonus = bonus * totalPlayers;
      }
      const data = {
        bonus: updateBonus,
        date: getNowDate()
      };
      await jackpot.updateOne({}, data);
      setLog(LogLevel.INFO, LogMessage.SUCCESS, updateJackPot.name);
      responseHandler.success(response, updateBonus.toString(), false);
    } catch (error) {
      baseController.errorHandler(response, error, updateJackPot.name);
    }
  },
  "updateJackPot"
);