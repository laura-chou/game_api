import { HTTP_STATUS } from "../src/common/constants";
import * as rescueMoneyController from "../src/controllers/rescueMoney.controller";
import RescueMoney from "../src/models/rescueMoney.model";

import { MOCK_DISTINCT_PLAYERS, MOCK_FORMATTED_DATA, MOCK_FORMATTED_TOP5, MOCK_NEW_EXTRA_PLAYER, MOCK_NEW_TOP_PLAYER, MOCK_RAW_DATA, ROUTE } from "./fixtures/rescueMoneyTestConfig";
import { describeServerErrorTests, describeValidationErrorTests } from "./fixtures/testStructures";
import { createRequest, expectResponse } from "./fixtures/testUtils";

jest.mock("../src/models/rescueMoney.model", () => ({
  find: jest.fn(),
  create: jest.fn(),
  distinct: jest.fn()
}));

const mockRescueMoneyCreate = (data: object = MOCK_NEW_TOP_PLAYER): void => {
  (RescueMoney.create as jest.Mock).mockResolvedValue(data);
};

const mockRescueMoneyFindSuccess = (data: object = MOCK_RAW_DATA): void => {
  (RescueMoney.find as jest.Mock).mockReturnValue({
    sort: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(data),
    }),
  });
};

const mockRescueMoneyFindError = (): void => {
  RescueMoney.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error("DB error")),
    }),
  });
};

const mockRescueMoneyDistinct = (isError: boolean = false): void => {
  if (isError) {
    (RescueMoney.distinct as jest.Mock).mockRejectedValueOnce(new Error("DB error"));
  } else {
    (RescueMoney.distinct as jest.Mock).mockResolvedValueOnce(MOCK_DISTINCT_PLAYERS);
  }
};

interface RouteTestCase {
  route: string;
  formattedData: object[];
}

const getRouteTestCases: RouteTestCase[] = [
  {
    route: ROUTE.BASE,
    formattedData: MOCK_FORMATTED_DATA,
  },
  {
    route: ROUTE.TOP5,
    formattedData: MOCK_FORMATTED_TOP5,
  },
];

describe("Rescue Money API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  getRouteTestCases.forEach(({ route, formattedData }) => {
    describe(`GET ${route}`, () => {
      describe("Success Cases", () => {
        test("should return formatted data when records exist", async() => {
          mockRescueMoneyFindSuccess();

          const response = await createRequest.get(route, HTTP_STATUS.OK);
          expectResponse.success(response, formattedData);
        });

        test("should return empty array when no records found", async() => {
          mockRescueMoneyFindSuccess([]);

          const response = await createRequest.get(route, HTTP_STATUS.OK);
          expectResponse.success(response, []);
        });
      });

      describeServerErrorTests(
        {
          route,
          requestFn: createRequest.get,
          dbErrorCases: [
            {
              name: "RescueMoney.find",
              mockFn: RescueMoney.find as jest.Mock,
              setupMocks: mockRescueMoneyFindError,
            },
          ],
        },
        expectResponse
      );
    });
  });

  describe(`POST ${ROUTE.CREATE}`, () => {
    describeValidationErrorTests(
      {
        route: ROUTE.CREATE,
        validBody: MOCK_NEW_TOP_PLAYER,
        requestFn: createRequest.post
      },
      expectResponse
    );

    describe("Success Cases", () => {
      test("creates a new player and returns success with isTopFive = true", async() => {
        mockRescueMoneyCreate();
        mockRescueMoneyFindSuccess();

        const response = await createRequest.post(ROUTE.CREATE, MOCK_NEW_TOP_PLAYER, HTTP_STATUS.OK);
        expectResponse.success(response, { isTopFive: true });
      });

      test("creates a new player and returns success with isTopFive = false", async() => {
        mockRescueMoneyCreate(MOCK_NEW_EXTRA_PLAYER);
        mockRescueMoneyFindSuccess();

        const response = await createRequest.post(ROUTE.CREATE, MOCK_NEW_EXTRA_PLAYER, HTTP_STATUS.OK);
        expectResponse.success(response, { isTopFive: false });
      });
    });

    describeServerErrorTests(
      {
        route: ROUTE.CREATE,
        requestFn: createRequest.post,
        requestBody: MOCK_NEW_TOP_PLAYER,
        dbErrorCases: [
          {
            name: "RescueMoney.create",
            mockFn: RescueMoney.create as jest.Mock
          },
          {
            name: "RescueMoney.find",
            mockFn: RescueMoney.find as jest.Mock,
            setupMocks: (): void => {
              mockRescueMoneyCreate([]);
              mockRescueMoneyFindError();
            }
          }
        ]
      },
      expectResponse
    );
  });
});

describe("Function Cases", () => {
  describe("getTotalPlayers", () => {
    test("should return the total player count", async() => {
      mockRescueMoneyDistinct();

      const result = await rescueMoneyController.getTotalPlayers();
      expect(result).toBe(3);
    });

    test("should return 500 if RescueMoney.distinct throws error", async() => {
      mockRescueMoneyDistinct(true);
      
      await expect(rescueMoneyController.getTotalPlayers()).rejects.toThrow("DB error");
    });
  });
});