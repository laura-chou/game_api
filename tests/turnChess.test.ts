import { HTTP_STATUS } from "../src/common/constants";
import TurnChess from "../src/models/turnChess.model";

import { describeServerErrorTests, describeValidationErrorTests } from "./fixtures/testStructures";
import { createRequest, expectResponse, RouteTestCase } from "./fixtures/testUtils";
import { MOCK_FORMATTED_DATA, MOCK_FORMATTED_TOP5, MOCK_NEW_EXTRA_PLAYER, MOCK_NEW_TOP_PLAYER, MOCK_RAW_DATA, ROUTE } from "./fixtures/turnChessTestConfig";

jest.mock("../src/models/turnChess.model.ts", () => ({
  find: jest.fn(),
  create: jest.fn()
}));

const mockTurnChessFindSuccess = (data: object = MOCK_RAW_DATA): void => {
  (TurnChess.find as jest.Mock).mockReturnValue({
    sort: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(data),
    }),
  });
};

const mockTurnChessFindError = (): void => {
  TurnChess.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error("DB error")),
    }),
  });
};

const mockTurnChessCreate = (data: object = MOCK_NEW_TOP_PLAYER): void => {
  (TurnChess.create as jest.Mock).mockResolvedValue(data);
};

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

describe("Turn Chess API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  getRouteTestCases.forEach(({ route, formattedData }) => {
    describe(`GET ${route}`, () => {
      describe("Success Cases", () => {
        test("should return formatted data when records exist", async() => {
          mockTurnChessFindSuccess();

          const response = await createRequest.get(route, HTTP_STATUS.OK);
          expectResponse.success(response, formattedData);
        });

        test("should return empty array when no records found", async() => {
          mockTurnChessFindSuccess([]);

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
              name: "TurnChess.find",
              mockFn: TurnChess.find as jest.Mock,
              setupMocks: mockTurnChessFindError,
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
        mockTurnChessCreate();
        mockTurnChessFindSuccess();

        const response = await createRequest.post(ROUTE.CREATE, MOCK_NEW_TOP_PLAYER, HTTP_STATUS.OK);
        expectResponse.success(response, { isTopFive: true });
      });

      test("creates a new player and returns success with isTopFive = false", async() => {
        mockTurnChessCreate(MOCK_NEW_EXTRA_PLAYER);
        mockTurnChessFindSuccess();

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
            name: "TurnChess.create",
            mockFn: TurnChess.create as jest.Mock
          },
          {
            name: "TurnChess.find",
            mockFn: TurnChess.find as jest.Mock,
            setupMocks: (): void => {
              mockTurnChessCreate([]);
              mockTurnChessFindError();
            }
          }
        ]
      },
      expectResponse
    );
  });
});