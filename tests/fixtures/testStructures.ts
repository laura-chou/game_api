import request from "supertest";

import { HTTP_STATUS } from "../../src/common/constants";

import { expectResponse } from "./testUtils";

type GetRequestFunction = (
  route: string,
  status: number
) => Promise<request.Response>;

type ModifyRequestFunction = (
  route: string,
  body: string | object,
  status: number
) => Promise<request.Response>;

interface ServerErrorConfig {
  route: string;
  requestFn: GetRequestFunction | ModifyRequestFunction;
  requestBody?: object;
  dbErrorCases: {
    name: string;
    mockFn: jest.Mock;
    setupMocks?: () => void;
  }[];
}

export const describeServerErrorTests = (
  config: ServerErrorConfig,
  expectResponseFn: typeof expectResponse
): void => {
  describe("Server Error Cases", () => {
    test.each(config.dbErrorCases)(
      "should return 500 if $name throws error",
      async({ mockFn, setupMocks }) => {
        if (setupMocks) {
          setupMocks();
        }

        mockFn.mockRejectedValue(new Error("DB Error"));

        const isModifyRequest = config.requestBody !== undefined;

        const response = await (isModifyRequest
          ? (config.requestFn as ModifyRequestFunction)(
              config.route,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              config.requestBody!,
              HTTP_STATUS.SERVER_ERROR
            )
          : (config.requestFn as GetRequestFunction)(
              config.route,
              HTTP_STATUS.SERVER_ERROR
            ));

        expectResponseFn.error(response);
      }
    );
  });
};