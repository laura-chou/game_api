import moment from 'moment-timezone'

export enum ApiStatus {
  NO_DATA = 200,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500
}

interface ApiResponse {
  statusCode: ApiStatus,
  message: string
}

const responseInfo = {
  NO_DATA: {
    statusCode: ApiStatus.NO_DATA,
    message: 'No data.'
  },
  INVALID_CONTENT_TYPE: {
    statusCode: ApiStatus.BAD_REQUEST,
    message: 'Invalid content-type. Expected application/json.'
  },
  INVALID_JSON_KEY: {
    statusCode: ApiStatus.BAD_REQUEST,
    message: 'Invalid JSON key.'
  },
  INVALID_JSON_FORMAT: {
    statusCode: ApiStatus.BAD_REQUEST,
    message: 'Invalid JSON format.'
  },
  SERVER_ERROR: {
    statusCode: ApiStatus.SERVER_ERROR,
    message: 'Server error.'
  }
}

type ResponseInfoKey = keyof typeof responseInfo;

const getResponse = (key: ResponseInfoKey): ApiResponse => {
  return responseInfo[key];
};

const noDataRes: ApiResponse = getResponse('NO_DATA')
const serverRes: ApiResponse = getResponse('SERVER_ERROR')
const contentTypeRes: ApiResponse = getResponse('INVALID_CONTENT_TYPE')
const jsonKeyRes: ApiResponse = getResponse('INVALID_JSON_KEY')
const jsonValueRes: ApiResponse = getResponse('INVALID_JSON_FORMAT')

export { noDataRes, serverRes, contentTypeRes, jsonKeyRes, jsonValueRes }

export const getNowDate = (): string => {
  return moment().tz('Asia/Taipei').format()
}

export const isNullOrEmpty = (value: string | null | undefined): boolean => {
  if (value == null) {
    return true;
  }
  return value.trim().length === 0;
};

export const isTypeInteger  = (value: unknown): boolean => {
  return Number.isInteger(value);
};

export const isTypeString = (value: unknown): boolean => {
  return typeof value === 'string'
}

export const isTypeBoolean = (value: unknown): boolean => {
  return typeof value === 'boolean'
}

export const convertToBool = (value: string | undefined): boolean => {
  if (!value) {
    return false
  }
  return value.toLowerCase() === 'true' || value === '1'
}

