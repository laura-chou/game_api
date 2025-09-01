import { Request, Response } from "express";

import { HTTP_STATUS, RESPONSE_MESSAGE } from "../common/constants";
import { convertToBool } from "../common/utils";

export const getResponse = (_: Request, response: Response): void => {
  if (convertToBool(process.env.MAINTENANCE)) {
    response.status(HTTP_STATUS.SERVER_UNAVAILABLE).send(RESPONSE_MESSAGE.SERVER_UNAVAILABLE);
    return;
  }
  response.status(HTTP_STATUS.OK).send(RESPONSE_MESSAGE.SUCCESS);
};