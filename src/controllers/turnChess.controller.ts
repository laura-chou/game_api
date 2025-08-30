import { Request, Response } from "express";

import { responseHandler } from "../common/response";
import { getNowDate, setFunctionName } from "../common/utils";
import { LogLevel, LogMessage, setLog } from "../core/logger";
import TurnChess, { IPlayer, IPlayerFormattedData, ITurnChess } from "../models/turnChess.model";

import * as baseController from "./base.controller";

const getFormattedData = (data: ITurnChess[]): IPlayerFormattedData[] => {
  const groupData = new Map<string, IPlayer[]>();

  for (const item of data) {
    const { spentTime, character, player, score } = item;
    const playerInfo: IPlayer = { character, player, score };
    
    const existingPlayers = groupData.get(spentTime) || [];

    if (!existingPlayers.some(p => p.player === player)) {
      groupData.set(spentTime, [...existingPlayers, playerInfo]);
    }
  }

  return Array.from(groupData.entries())
    .map(([spentTime, players]) => ({
      spentTime,
      players: players.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.character - b.character;
      })
    }))
    .sort((a, b) => {
      const [hoursA, minutesA] = a.spentTime.split(":").map(Number);
      const [hoursB, minutesB] = b.spentTime.split(":").map(Number);
      return (hoursA * 60 + minutesA) - (hoursB * 60 + minutesB);
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));
};

const getPlayersData = (): Promise<ITurnChess[]> => {
  return new Promise((resolve, reject) => {
    TurnChess
      .find({}, "-_id -date")
      .sort({ spentTime: "asc", score: "desc" })
      .lean()
      .then( result => {
        setLog(LogLevel.INFO, LogMessage.SUCCESS, getPlayersData.name);
        resolve(result);
      })
      .catch( error => {
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
  return data.some(item => item.players.some(playerInfo => playerInfo.player === player));
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

export const createPlayer = setFunctionName(
  async(request: Request, response: Response): Promise<void> => {
    try {
      if (!baseController.validateContentType(request, response, createPlayer.name)) {
        return;
      }
      const fields = [
        { key: "character", type: "integer" },
        { key: "player", type: "string" },
        { key: "score", type: "integer" },
        { key: "spentTime", type: "string" }
      ];
      if (!baseController.validateBodyFields(request, response, createPlayer.name, fields)) {
        return;
      }

      const data = {
        ...request.body,
        date: getNowDate()
      };

      await TurnChess.create(data);

      setLog(LogLevel.INFO, LogMessage.SUCCESS, createPlayer.name);

      const playersData = await getPlayersData();
      const resultData = getFormattedData(playersData).slice(0, 5);
      responseHandler.success(response, { isTopFive: isPlayerInList(resultData, data.player) });
    } catch (error) {
      baseController.errorHandler(response, error, createPlayer.name);
    }
  },
  "createPlayer"
);