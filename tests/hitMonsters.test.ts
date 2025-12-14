import { HTTP_STATUS } from "../src/common/constants";
import HitMonsters from "../src/models/hitMonsters.model";

import { ROUTE, MOCK_RAW_DATA, MOCK_NEW_TOP_PLAYER, MOCK_NEW_EXTRA_PLAYER, MOCK_FORMATTED_DATA, MOCK_FORMATTED_TOP5 } from "./fixtures/hitMonstersTestConfig";
import { describeServerErrorTests, describeValidationErrorTests } from "./fixtures/testStructures";
import { createRequest, expectResponse, RouteTestCase } from "./fixtures/testUtils";

jest.mock("../src/models/hitMonsters.model", () => ({
  find: jest.fn(),
  create: jest.fn()
}));

const mockHitMonstersCreate = (data: object = MOCK_NEW_TOP_PLAYER): void => {
  (HitMonsters.create as jest.Mock).mockResolvedValue(data);
};

const mockHitMonstersFindSuccess = (data: object = MOCK_RAW_DATA): void => {
  (HitMonsters.find as jest.Mock).mockReturnValue({
    sort: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(data),
    }),
  });
};

const mockHitMonstersFindError = (): void => {
  HitMonsters.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error("DB error")),
    }),
  });
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

describe("Hit Monsters API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  getRouteTestCases.forEach(({ route, formattedData }) => {
    describe(`GET ${route}`, () => {
      describe("Success Cases", () => {
        test("should return formatted data when records exist", async() => {
          mockHitMonstersFindSuccess();

          const response = await createRequest.get(route, HTTP_STATUS.OK);
          expectResponse.success(response, formattedData);
        });

        test("should return empty array when no records found", async() => {
          mockHitMonstersFindSuccess([]);

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
              name: "HitMonsters.find",
              mockFn: HitMonsters.find as jest.Mock,
              setupMocks: mockHitMonstersFindError,
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
      test("creates a new player and returns success with topFive = true", async() => {
        mockHitMonstersCreate();
        mockHitMonstersFindSuccess();

        const response = await createRequest.post(ROUTE.CREATE, MOCK_NEW_TOP_PLAYER, HTTP_STATUS.OK);
        expectResponse.success(response, { topFive: true });
      });

      test("creates a new player and returns success with topFive = false", async() => {
        mockHitMonstersCreate(MOCK_NEW_EXTRA_PLAYER);
        mockHitMonstersFindSuccess();

        const response = await createRequest.post(ROUTE.CREATE, MOCK_NEW_EXTRA_PLAYER, HTTP_STATUS.OK);
        expectResponse.success(response, { topFive: false });
      });
    });

    describeServerErrorTests(
      {
        route: ROUTE.CREATE,
        requestFn: createRequest.post,
        requestBody: MOCK_NEW_TOP_PLAYER,
        dbErrorCases: [
          {
            name: "HitMonsters.create",
            mockFn: HitMonsters.create as jest.Mock
          },
          {
            name: "HitMonsters.find",
            mockFn: HitMonsters.find as jest.Mock,
            setupMocks: (): void => {
              mockHitMonstersCreate([]);
              mockHitMonstersFindError();
            }
          }
        ]
      },
      expectResponse
    );
  });
});