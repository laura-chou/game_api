import { Request, Response } from "express";

import { responseHandler } from "../common/response";
import { getNowDate, setFunctionName } from "../common/utils";
import { LogLevel, LogMessage, setLog } from "../core/logger";
import HitMonsters, { IHitMonsters } from "../models/hitMonsters.model";

import * as baseController from "./base.controller";

export interface IPlayerFormattedData {
  rank: number;
  spentTime: string;
  players: string[];
}

const getFormattedData = (data: IHitMonsters[]): IPlayerFormattedData[] => {
  const groupData = new Map<string, Set<string>>();

  for (const { spentTime, player } of data) {
    if (!spentTime || !player) continue;

    if (!groupData.has(spentTime)) {
      groupData.set(spentTime, new Set());
    }

    groupData.get(spentTime)?.add(player);
  }

  return [...groupData.entries()]
    .map(([spentTime, players]) => ({
      spentTime,
      players: [...players]
    }))
    .sort((a, b) => {
      const toMinutes = (t: string): number => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };
      return toMinutes(a.spentTime) - toMinutes(b.spentTime);
    })
    .map((item, index) => ({
      rank: index + 1,
      ...item
    }));
};

const getPlayersData = (): Promise<IHitMonsters[]> => {
  return new Promise((resolve, reject) => {
    HitMonsters
      .find({}, "-_id -date")
      .sort({ spentTime: "asc" })
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

const isPlayerInList = (data: IPlayerFormattedData[], player: string): boolean => {
  return data.some(item => item.players.some(p => p === player));
};

export const createPlayer = setFunctionName(
  async(request: Request, response: Response): Promise<void> => {
    try {
      if (!baseController.validateContentType(request, response, createPlayer.name)) {
        return;
      }

      const fields = [
        { key: "player", type: "string" },
        { key: "spentTime", type: "string" },
      ];
      if (!baseController.validateBodyFields(request, response, createPlayer.name, fields)) {
        return;
      }

      const data = {
        ...request.body,
        date: getNowDate()
      };

      await HitMonsters.create(data);

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