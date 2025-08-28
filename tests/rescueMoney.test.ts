import { HTTP_STATUS } from "../src/common/constants";
import rescueMoney from "../src/models/rescueMoney.model";

import { MOCK_FORMATTED_DATA, MOCK_FORMATTED_TOP5, MOCK_NEW_EXTRA_PLAYER, MOCK_NEW_TOP_PLAYER, MOCK_RAW_DATA, ROUTE } from "./fixtures/rescueMoneyTestConfig";
import { describeServerErrorTests, describeValidationErrorTests } from "./fixtures/testStructures";
import { createRequest, expectResponse } from "./fixtures/testUtils";

jest.mock("../src/models/rescueMoney.model", () => ({
  find: jest.fn(),
  create: jest.fn()
}));

const mockRescueMoneyCreate = (data: object = MOCK_NEW_TOP_PLAYER): void => {
  (rescueMoney.create as jest.Mock).mockResolvedValue(data);
};

const mockRescueMoneyFindSuccess = (data: object = MOCK_RAW_DATA): void => {
  (rescueMoney.find as jest.Mock).mockReturnValue({
    sort: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(data),
    }),
  });
};

const mockRescueMoneyFindError = (): void => {
  rescueMoney.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error("DB Error")),
    }),
  });
};

interface RouteTestCase {
  name: string;
  route: string;
  formattedData: object[];
}

const getRouteTestCases: RouteTestCase[] = [
  {
    name: "BASE",
    route: ROUTE.BASE,
    formattedData: MOCK_FORMATTED_DATA,
  },
  {
    name: "TOP5",
    route: ROUTE.TOP5,
    formattedData: MOCK_FORMATTED_TOP5,
  },
];

describe("Rescue Money API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  getRouteTestCases.forEach(({ name, route, formattedData }) => {
    describe(`GET ${route} (${name})`, () => {
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
              name: "rescueMoney.find",
              mockFn: rescueMoney.find as jest.Mock,
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
            name: "rescueMoney.create",
            mockFn: rescueMoney.create as jest.Mock
          },
          {
            name: "rescueMoney.find",
            mockFn: rescueMoney.find as jest.Mock,
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