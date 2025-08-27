import { Request, Response } from "express";

import { responseHandler } from "../common/response";
import { setFunctionName } from "../common/utils";
import { LogLevel, LogMessage, setLog } from "../core/logger";
import rescueMoney, { IRescueMoney } from "../models/rescueMoney.model";

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
    rescueMoney
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

export const getPlayers = setFunctionName(
  async(_request: Request, response: Response): Promise<void> => {
    try {
      const result = await getPlayersData();
      setLog(LogLevel.INFO, LogMessage.SUCCESS, getPlayers.name);
      responseHandler.success(response, getFormattedData(result));
    } catch (error) {
      baseController.errorHandler(response, error, getPlayers.name);
    }
  },
  "getPlayers"
);

export const getTotalPlayers = setFunctionName(
  async(): Promise<number> => {
    try {
      const result = await rescueMoney.distinct("player");
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

export const getTopFive = setFunctionName(
  async(_request: Request, response: Response): Promise<void> => {
    try {
      const data = await getPlayersData();
      setLog(LogLevel.INFO, LogMessage.SUCCESS, getTopFive.name);
      responseHandler.success(response, getFormattedData(data).slice(0, 5));
    } catch (error) {
      baseController.errorHandler(response, error, getTopFive.name);
    }
  },
  "getTopFive"
);

// export const getTopFive = baseController.getTopFiveData<IRescueMoney, IPlayerFormattedData>(
//   getPlayersData,
//   getFormattedData,
//   "getTopFive"
// );

// export const addPlayer = baseController.addPlayerData<IRescueMoney, IPlayerFormattedData>(
//   rescueMoney,
//   [
//     { key: "player", type: "string" },
//     { key: "money", type: "string" }
//   ],
//   getPlayersData,
//   getFormattedData,
//   (data, newPlayer) => data.some(item => item.players.includes(newPlayer)),
//   "addPlayer"
// );