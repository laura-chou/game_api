export const getDate = () => {
  const currentDate = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h24',
    timeZone: 'Asia/Taipei'
  }).format(new Date())

  return currentDate
}

export const sendResponse = (res, status, success, message, data = null) => {
  const response = {
    success: success,
    message: message
  }
  if (data) response.data = data
  res.status(status).send(response)
}

export const isNullOrEmpty = (value) => {
  return value === null || value === undefined || value.length === 0
}
