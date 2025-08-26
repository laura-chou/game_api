import { Request, Response } from "express";
import { Model, SortOrder } from "mongoose";

import { RESPONSE_MESSAGE } from "../common/constants";
import { responseHandler } from "../common/response";
import {
    getNowDate, isNullOrEmpty, isTypeBoolean, isTypeInteger, isTypeString
} from "../common/utils";
import { LogLevel, LogMessage, setLog } from "../core/logger";

type SortParam = {
  field: string;
  order: SortOrder;
};

export const errorHandler = (
  response: Response,
  error: unknown,
  functionName: string
): void => {
  setLog(
    LogLevel.ERROR,
    error instanceof Error ? error.message : LogMessage.ERROR.UNKNOWN,
    functionName);
  responseHandler.serverError(response);
};

export const validateContentType = (request: Request, response: Response, functionName: string): boolean => {
  const contentType: string | undefined = request.headers["content-type"];
  if (contentType !== "application/json") {
    setLog(LogLevel.ERROR, RESPONSE_MESSAGE.INVALID_CONTENT_TYPE, functionName);
    responseHandler.badRequest(response, "CONTENT_TYPE");
    return false;
  }
  return true;
};

const validateFieldType = (value: unknown, type: string): boolean => {
  switch (type) {
    case "string":
      return isTypeString(value);
    case "integer":
      return isTypeInteger(value);
    case "boolean":
      return isTypeBoolean(value);
    default:
      return false;
  }
};

export const validateBodyFields = (
  request: Request,
  response: Response,
  functionName: string,
  fields: { key: string, type: string }[]
): boolean => {
  for (const field of fields) {
    if (isNullOrEmpty(request.body[field.key])) {
      setLog(LogLevel.ERROR, RESPONSE_MESSAGE.INVALID_JSON_KEY, functionName);
      responseHandler.badRequest(response, "JSON_KEY");
      return false;
    }
    
    if (!validateFieldType(request.body[field.key], field.type)) {
      setLog(LogLevel.ERROR, RESPONSE_MESSAGE.INVALID_JSON_FORMAT, functionName);
      responseHandler.badRequest(response, "JSON_FORMAT");
      return false;
    }
  }
  return true;
};

export const getModelData = async <T>(
  model: Model<T>,
  sortParams: SortParam | SortParam[],
  functionName: string
): Promise<T[]> => {
  try {
    const sortOptions = Array.isArray(sortParams) 
      ? sortParams.reduce((acc, { field, order }) => ({ ...acc, [field]: order }), {})
      : { [sortParams.field]: sortParams.order };

    const result = await model
      .find({}, "-_id -date")
      .sort(sortOptions)
      .lean();
    setLog(LogLevel.INFO, LogMessage.SUCCESS, functionName);
    return result as T[];
  } catch (error) {
    setLog(
      LogLevel.ERROR,
      error instanceof Error ? error.message : LogMessage.ERROR.UNKNOWN,
      functionName);
    throw error;
  }
};

export const getPlayersData = <T>(
  getPlayersData: () => Promise<T[]>,
  getFormattedData: (data: T[]) => unknown,
  functionName: string
) => {
  return async(_: Request, response: Response): Promise<void> => {
    try {
      const data = await getPlayersData();
      setLog(LogLevel.INFO, LogMessage.SUCCESS, functionName);
      responseHandler.success(response, getFormattedData(data));
    } catch (error) {
      errorHandler(response, error, functionName);
    }
  };
};

export const getTopFiveData = <T, R>(
  getPlayersData: () => Promise<T[]>,
  getFormattedData: (data: T[]) => R[],
  functionName: string
) => {
  return async(_: Request, response: Response): Promise<void> => {
    try {
      const data = await getPlayersData();
      setLog(LogLevel.INFO, LogMessage.SUCCESS, functionName);
      if (data.length > 0) {
        responseHandler.success(response, getFormattedData(data).slice(0, 5));
        return;
      }
      responseHandler.noData(response);
    } catch (error) {
      errorHandler(response, error, functionName);
    }
  };
};

export const addPlayerData = <T, R>(
  model: Model<T>,
  fields: { key: string, type: string }[],
  getPlayersData: () => Promise<T[]>,
  getFormattedData: (data: T[]) => R[],
  isTopFive: (data: R[], newPlayer: string) => boolean,
  functionName: string
) => {
  return async(request: Request, response: Response): Promise<void> => {
    try {
      if (!validateContentType(request, response, functionName)) {
        return;
      }
      if (!validateBodyFields(request, response, functionName, fields)) {
        return;
      }

      const data = {
        ...request.body,
        date: getNowDate()
      };

      await model.create(data);
      setLog(LogLevel.INFO, LogMessage.SUCCESS, functionName);

      const playersData = await getPlayersData();
      let resultData: R[] = [];
      if (playersData.length > 0) {
        resultData = getFormattedData(playersData).slice(0, 5);
      }

      const isTop = isTopFive(resultData, data.player);
      responseHandler.success(response, { isTopFive: isTop });
    } catch (error) {
      errorHandler(response, error, functionName);
    }
  };
};