export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  SERVER_ERROR: 500
} as const;

export const CONTENT_TYPE = {
  JSON: "application/json",
  JSON_WITH_CHARSET: /application\/json/,
  TEXT: "text/plain",
  TEXT_WITH_CHARSET: /text\/plain/,
  FORM_URLENCODED: "application/x-www-form-urlencoded"
} as const;

export const RESPONSE_MESSAGE = {
  SUCCESS: "",
  SERVER_ERROR: "Internal server error.",
  INVALID_CONTENT_TYPE: "Invalid content type.",
  INVALID_JSON_KEY: "Invalid JSON key.",
  INVALID_JSON_FORMAT: "Invalid JSON format.",
  ENV_ERROR: "Environment variable is not setting.",
  FORBIDDEN_CORS: "Forbidden: CORS policy does not allow access from this origin.",
} as const;