import request, { Response } from "supertest";

import app from "../../src/app";
import { CONTENT_TYPE, HTTP_STATUS, RESPONSE_MESSAGE } from "../../src/common/constants";
import { isTypeString } from "../../src/common/utils";


export const createRequest = {
  get: (
    route: string,
    status: number,
    isExpectJson: boolean = true
  ): request.Test => {
    const contentType = isExpectJson ? CONTENT_TYPE.JSON_WITH_CHARSET : CONTENT_TYPE.TEXT_WITH_CHARSET;
    return request(app)
      .get(route)
      .expect("Content-Type", contentType)
      .expect(status);
  },

  post: (
    route: string,
    body: string | object,
    status: number,
    isSetJson: boolean = true,
    isExpectJson: boolean = true
  ): request.Test => {
    const setContentType = isSetJson ? CONTENT_TYPE.JSON : CONTENT_TYPE.FORM_URLENCODED;
    const expectContentType = isExpectJson ? CONTENT_TYPE.JSON_WITH_CHARSET : CONTENT_TYPE.TEXT_WITH_CHARSET;
    return request(app)
      .post(route)
      .set("Content-Type", setContentType)
      .send(body)
      .expect("Content-Type", expectContentType)
      .expect(status);
  },

  patch: (
    route: string,
    body: string | object,
    status: number,
    isSetJson: boolean = true,
    isExpectJson: boolean = true
  ): request.Test => {
    const setContentType = isSetJson ? CONTENT_TYPE.JSON : CONTENT_TYPE.FORM_URLENCODED;
    const expectContentType = isExpectJson ? CONTENT_TYPE.JSON_WITH_CHARSET : CONTENT_TYPE.TEXT_WITH_CHARSET;
    return request(app)
      .patch(route)
      .set("Content-Type", setContentType)
      .send(body)
      .expect("Content-Type", expectContentType)
      .expect(status);
  }
};

export const expectResponse = {
  success: (response: Response, data: string | object): void => {
    if (isTypeString(data)) {
      expect(response.text).toBe(data);
    } else {
      expect(response.body).toEqual({
        status: HTTP_STATUS.OK,
        message: RESPONSE_MESSAGE.SUCCESS,
        data: data
      });
    }
  },

  badRequest: (response: Response, message: string): void => {
    expect(response.body).toEqual({
      status: HTTP_STATUS.BAD_REQUEST,
      message: message
    });
  },

  error: (response: Response): void => {
    expect(response.body).toEqual({
      status: HTTP_STATUS.SERVER_ERROR,
      message: RESPONSE_MESSAGE.SERVER_ERROR
    });
  }
};