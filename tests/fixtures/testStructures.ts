import request from "supertest";

import { HTTP_STATUS, RESPONSE_MESSAGE } from "../../src/common/constants";

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

type ValidationTestCase = [
  description: string,
  requestBody: Record<string, unknown>,
  isSetJson: boolean,
  expectedMessage: string
];

interface ValidationConfig<T extends Record<string, unknown>> {
  route: string;
  validBody: T;
  requestFn: (
    route: string,
    body: Partial<T> | Record<string, unknown>,
    status: number,
    isSetJson?: boolean
  ) => Promise<request.Response>;
}

type ValidationBaseModel = {
  [key: string]: unknown;
};

const generateInvalidTypeBody = <T extends Record<string, unknown>>(validBody: T): { [K in keyof T]: unknown } => {
  return Object.keys(validBody).reduce((acc, key) => {
    const value = validBody[key as keyof T];

    let invalidValue: unknown;

    if (typeof value === "number") {
      invalidValue = "not a number";
    } else if (typeof value === "string") {
      invalidValue = 9999;
    } else if (typeof value === "boolean") {
      invalidValue = "true";
    } else if (Array.isArray(value)) {
      invalidValue = "not an array";
    } else if (typeof value === "object" && value !== null) {
      invalidValue = "not an object";
    } else {
      invalidValue = null;
    }

    return { ...acc, [key]: invalidValue };
  }, {} as { [K in keyof T]: unknown });
};

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

export const describeValidationErrorTests = <T extends ValidationBaseModel>(
  config: ValidationConfig<T>,
  expectResponseFn: typeof expectResponse
): void => {
  describe("Validation Error Cases", () => {
    const validationTestCases: ValidationTestCase[] = [
      ["invalid Content-Type", config.validBody, false, RESPONSE_MESSAGE.INVALID_CONTENT_TYPE],
      ["missing key in JSON body", { wrongKey: "value" }, true, RESPONSE_MESSAGE.INVALID_JSON_KEY],
      ["invalid data type", generateInvalidTypeBody(config.validBody), true, RESPONSE_MESSAGE.INVALID_JSON_FORMAT]
    ];

    test.each(validationTestCases)(
      "should bad request for %s",
      async(_, requestBody, isSetJson, expectedMessage) => {
        const response = await config.requestFn(
          config.route,
          requestBody,
          HTTP_STATUS.BAD_REQUEST,
          isSetJson
        );
        expectResponseFn.badRequest(response, expectedMessage);
      }
    );
  });
};