import moment from "moment-timezone"
import { Response } from "express"

enum ApiStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500
}

interface ApiResponse<T> {
  status: ApiStatus
  message: string
  data?: T
}

export const responseMessage = {
  SUCCESS: "",
  NO_DATA: "No data.",
  SERVER_ERROR: "Internal server error.",
  INVALID_CONTENT_TYPE: "Invalid content type.",
  INVALID_JSON_KEY: "Invalid JSON key.",
  INVALID_JSON_FORMAT: "Invalid JSON format.",
  ENV_ERROR: "Environment variable is not setting."
}

const sendResponse = <T>(res: Response, status: ApiStatus, message: string, isJson: boolean = true, data?: T): void => {
  if (isJson) {
    const response: ApiResponse<T> = {
        status,
        message,
        ...(data !== undefined && { data })
    }
    res.status(status).json(response)
    return
  }
  res.status(status).send(data)
}

export const responseHandler = {
  success<T>(res: Response, data?: T, isJson: boolean = true): void {
    sendResponse(
      res, 
      ApiStatus.SUCCESS, 
      responseMessage.SUCCESS, 
      isJson,
      data
    )
  },

  noData(res: Response): void {
    sendResponse(
      res, 
      ApiStatus.SUCCESS, 
      responseMessage.NO_DATA
    )
  },

  serverError(res: Response): void {
    sendResponse(
      res, 
      ApiStatus.SERVER_ERROR, 
      responseMessage.SERVER_ERROR
    )
  },

  badRequest(res: Response, type: "CONTENT_TYPE" | "JSON_KEY" | "JSON_FORMAT"): void {
    const messageMap = {
      CONTENT_TYPE: responseMessage.INVALID_CONTENT_TYPE,
      JSON_KEY: responseMessage.INVALID_JSON_KEY,
      JSON_FORMAT: responseMessage.INVALID_JSON_FORMAT
    }

    sendResponse(
      res, 
      ApiStatus.BAD_REQUEST, 
      messageMap[type]
    )
  },
}

export const getNowDate = (): string => {
  return moment().tz("Asia/Taipei").format()
}

export const isNullOrEmpty = (value: string | null | undefined): boolean => {
  if (value == null) {
    return true
  }
  return value.trim().length === 0
}

export const isTypeInteger = (value: unknown): boolean => {
  return Number.isInteger(value)
}

export const isTypeString = (value: unknown): boolean => {
  return typeof value === "string"
}

export const isTypeBoolean = (value: unknown): boolean => {
  return typeof value === "boolean"
}

export const convertToBool = (value: string | undefined): boolean => {
  if (!value) {
    return false
  }
  return value.toLowerCase() === "true" || value === "1"
}

