import { Request, Response } from "express";

import { responseHandler } from "../common/response";
import { getNowDate, setFunctionName } from "../common/utils";
import { LogLevel, LogMessage, setLog } from "../core/logger";
import RescueMoney, { IRescueMoney } from "../models/rescueMoney.model";

import * as baseController from "./base.controller";

interface IPlayerFormattedData {
  rank: number;
  money: string;
  players: string[];
}

const getFormattedData = (data: IRescueMoney[]): IPlayerFormattedData[] => {
  const groupData = new Map<string, Set<string>>();

  for (const { money, player } of data) {
    if (!money || !player) continue;
    if (!groupData.has(money)) groupData.set(money, new Set());
    const playerSet = groupData.get(money);
    if (playerSet) {
      playerSet.add(player);
    }
  }
  
  return Array.from(groupData.entries())
    .map(([money, players]) => ({
      money,
      players: Array.from(players)
    }))
    .sort((a, b) => parseFloat(b.money) - parseFloat(a.money))
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));
};

const getPlayersData = (): Promise<IRescueMoney[]> => {
  return new Promise((resolve, reject) => {
    RescueMoney
      .find({}, "-_id -date")
      .sort({ money: "desc" })
      .lean()
      .then((result) => {
        setLog(LogLevel.INFO, LogMessage.SUCCESS, getPlayersData.name);
        resolve(result);
      })
      .catch((error) => {
        setLog(
          LogLevel.ERROR,
          error instanceof Error ? error.message : "Unknown error",
          getPlayersData.name
        );
        reject(error);
      });
  });
};

const isPlayerInList = (data: IPlayerFormattedData[], player: string): boolean => {
  return data.some(item => item.players.includes(player));
};

export const getPlayers = baseController.createGetPlayersHandler({
  name: "getPlayers",
  getPlayersData,
  getFormattedData
});

export const getTopFive = baseController.createGetPlayersHandler({
  name: "getTopFive",
  getPlayersData,
  getFormattedData,
  sliceFn: data => data.slice(0, 5),
});

export const getTotalPlayers = setFunctionName(
  async(): Promise<number> => {
    try {
      const result = await RescueMoney.distinct("player");
      setLog(LogLevel.INFO, LogMessage.SUCCESS, getTotalPlayers.name);
      return result.length;
    } catch (error) {
      setLog(
        LogLevel.ERROR,
        error instanceof Error ? error.message : LogMessage.ERROR.UNKNOWN,
        getTotalPlayers.name);
      throw error;
    }
  },
  "getTotalPlayers"
);

export const createPlayer = setFunctionName(
  async(request: Request, response: Response): Promise<void> => {
    try {
      if (!baseController.validateContentType(request, response, createPlayer.name)) {
        return;
      }
      const fields = [
        { key: "player", type: "string" },
        { key: "money", type: "string" }
      ];
      if (!baseController.validateBodyFields(request, response, createPlayer.name, fields)) {
        return;
      }

      const data = {
        ...request.body,
        date: getNowDate()
      };

      await RescueMoney.create(data);

      setLog(LogLevel.INFO, LogMessage.SUCCESS, createPlayer.name);

      const playersData = await getPlayersData();
      const resultData = getFormattedData(playersData).slice(0, 5);
      responseHandler.success(response, { topFive: isPlayerInList(resultData, data.player) });
    } catch (error) {
      baseController.errorHandler(response, error, createPlayer.name);
    }
  },
  "createPlayer"
);