import { HTTP_STATUS } from "../src/common/constants";
import rescueMoney from "../src/models/rescueMoney.model";

import { MOCK_FORMATTED_DATA, MOCK_FORMATTED_TOP5, MOCK_RAW_DATA, ROUTE } from "./fixtures/rescueMoneyTestConfig";
import { describeServerErrorTests } from "./fixtures/testStructures";
import { createRequest, expectResponse } from "./fixtures/testUtils";

jest.mock("../src/models/rescueMoney.model", () => ({
  find: jest.fn()
}));

describe("Rescue Money API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe(`GET ${ROUTE.BASE}`, () => {
    describe("Success Cases", () => {
      test("should return formatted and sorted player data when data exists", async() => {
        (rescueMoney.find as jest.Mock).mockReturnValue({
          sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(MOCK_RAW_DATA),
          }),
        });
        const response = await createRequest.get(ROUTE.BASE, HTTP_STATUS.OK);

        expectResponse.success(response, MOCK_FORMATTED_DATA);
      });

      test("should return empty data when no players found", async() => {
        (rescueMoney.find as jest.Mock).mockReturnValue({
          sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([]),
          }),
        });

        const response = await createRequest.get(ROUTE.BASE, HTTP_STATUS.OK);
        expectResponse.success(response, []);
      });
    });

    describeServerErrorTests(
      {
        route: ROUTE.BASE,
        requestFn: createRequest.get,
        dbErrorCases: [
          {
            name: "rescueMoney.find",
            mockFn: rescueMoney.find as jest.Mock,
            setupMocks: (): void => {
              rescueMoney.find = jest.fn().mockReturnValue({
                sort: jest.fn().mockReturnValue({
                  lean: jest.fn().mockRejectedValue(new Error("DB Error"))
                })
              });
            }
          }
        ]
      },
      expectResponse
    );
  });

  describe(`GET ${ROUTE.TOP5}`, () => {
    describe("Success Cases", () => {
      test("should return top 5 formatted and sorted player data when data exists", async() => {
        (rescueMoney.find as jest.Mock).mockReturnValue({
          sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(MOCK_RAW_DATA),
          }),
        });
        const response = await createRequest.get(ROUTE.TOP5, HTTP_STATUS.OK);

        expectResponse.success(response, MOCK_FORMATTED_TOP5);
      });

      test("should return empty data when no players found", async() => {
        (rescueMoney.find as jest.Mock).mockReturnValue({
          sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([]),
          }),
        });

        const response = await createRequest.get(ROUTE.TOP5, HTTP_STATUS.OK);
        expectResponse.success(response, []);
      });
    });

    describeServerErrorTests(
      {
        route: ROUTE.TOP5,
        requestFn: createRequest.get,
        dbErrorCases: [
          {
            name: "rescueMoney.find",
            mockFn: rescueMoney.find as jest.Mock,
            setupMocks: (): void => {
              rescueMoney.find = jest.fn().mockReturnValue({
                sort: jest.fn().mockReturnValue({
                  lean: jest.fn().mockRejectedValue(new Error("DB Error"))
                })
              });
            }
          }
        ]
      },
      expectResponse
    );
  });
});