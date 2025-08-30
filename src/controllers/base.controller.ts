import { Request, RequestHandler, Response } from "express";

import { RESPONSE_MESSAGE } from "../common/constants";
import { responseHandler } from "../common/response";
import {
    isNullOrEmpty, isTypeBoolean, isTypeInteger, isTypeString,
    setFunctionName
} from "../common/utils";
import { LogLevel, LogMessage, setLog } from "../core/logger";

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

interface HandlerOptions<TInput, TOutput> {
  name: string;
  getPlayersData: () => Promise<TInput[]>;
  getFormattedData: (raw: TInput[]) => TOutput[];
  sliceFn?: (data: TOutput[]) => TOutput[];
}

export const createGetPlayersHandler = <TInput, TOutput>(
  options: HandlerOptions<TInput, TOutput>
): RequestHandler => {
  const { name, getPlayersData, getFormattedData, sliceFn } = options;

  return setFunctionName(
    async(_request: Request, response: Response): Promise<void> => {
      try {
        const raw = await getPlayersData();
        setLog(LogLevel.INFO, LogMessage.SUCCESS, name);

        const formatted = getFormattedData(raw);
        const payload = sliceFn ? sliceFn(formatted) : formatted;

        responseHandler.success(response, payload);
      } catch (error) {
        errorHandler(response, error, name);
      }
    },
    name
  );
};