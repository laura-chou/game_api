import 'dotenv/config'
import { promises as fs } from 'fs'

let noDataRes, serverRes, contentTypeRes, jsonKeyRes, jsonValueRes

const getResponseInfo = async (situation) => {
  const data = await fs.readFile('json/responseInfo.json', 'utf8')
  const resInfo = JSON.parse(data)
  return resInfo.find(info => info.situation === situation)
}

const init = async () => {
  noDataRes = await getResponseInfo('noData')
  serverRes = await getResponseInfo('server')
  contentTypeRes = await getResponseInfo('contentType')
  jsonKeyRes = await getResponseInfo('jsonKey')
  jsonValueRes = await getResponseInfo('jsonValue')
}
init()

export { noDataRes, serverRes, contentTypeRes, jsonKeyRes, jsonValueRes }

export const getNowDate = () => {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h24',
    timeZone: 'Asia/Taipei'
  }).format(new Date())
}

export const sendResponse = (res, statusCode, status, message, data = null) => {
  const response = {
    status: status,
    message: message
  }
  if (data) response.data = data
  res.status(statusCode).send(response)
}

export const isNullOrEmpty = (value) => {
  return value === null || value === undefined || value.length === 0
}
export const isTypeBoolean = (value) => {
  return typeof value === 'boolean'
}
export const isTypeString = (value) => {
  return typeof value === 'string'
}
export const isTypeInteger = (value) => {
  return typeof value === 'number' && Number.isInteger(value)
}
export const convertToBool = (value) => {
  return value === 'true' || value === '1'
}
