import { Request, RequestHandler, Response } from "express";

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

type HandlerOptions = {
  name: string;
  sliceFn?: (data: object[]) => object[];
};

const createGetPlayersHandler = (options: HandlerOptions): RequestHandler => {
  const { name, sliceFn } = options;

  return setFunctionName(
    async(_request: Request, response: Response): Promise<void> => {
      try {
        const raw = await getPlayersData();
        setLog(LogLevel.INFO, LogMessage.SUCCESS, name);

        const formatted = getFormattedData(raw);
        const payload = sliceFn ? sliceFn(formatted) : formatted;

        responseHandler.success(response, payload);
      } catch (error) {
        baseController.errorHandler(response, error, name);
      }
    },
    name
  );
};

export const getPlayers = createGetPlayersHandler({
  name: "getPlayers",
});

export const getTopFive = createGetPlayersHandler({
  name: "getTopFive",
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

export const addPlayer = setFunctionName(
  async(request: Request, response: Response): Promise<void> => {
    try {
      if (!baseController.validateContentType(request, response, addPlayer.name)) {
        return;
      }
      const fields = [
        { key: "player", type: "string" },
        { key: "money", type: "string" }
      ];
      if (!baseController.validateBodyFields(request, response, addPlayer.name, fields)) {
        return;
      }

      const data = {
        ...request.body,
        date: getNowDate()
      };

      await RescueMoney.create(data);

      setLog(LogLevel.INFO, LogMessage.SUCCESS, addPlayer.name);

      const playersData = await getPlayersData();
      const resultData = getFormattedData(playersData).slice(0, 5);
      responseHandler.success(response, { isTopFive: isPlayerInList(resultData, data.player) });
    } catch (error) {
      baseController.errorHandler(response, error, addPlayer.name);
    }
  },
  "addPlayer"
);