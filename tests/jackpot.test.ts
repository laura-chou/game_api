import { HTTP_STATUS } from "../src/common/constants";
import * as rescueMoneyController from "../src/controllers/rescueMoney.controller";
import Jackpot from "../src/models/jackpot.model";

import { MOCK_BONUS_DATA, MOCK_UPDATE_WIN_FALSE, MOCK_UPDATE_WIN_TRUE, ROUTE, TEST_DATA } from "./fixtures/jackpotTestConfig";
import { describeServerErrorTests, describeValidationErrorTests } from "./fixtures/testStructures";
import { createRequest, expectResponse } from "./fixtures/testUtils";

jest.mock("../src/models/jackpot.model", () => ({
  findOne: jest.fn(),
  updateOne: jest.fn()
}));

jest.mock("../src/controllers/rescueMoney.controller", () => ({
  getTotalPlayers: jest.fn(),
  getPlayers: jest.fn(),
  getTopFive: jest.fn(),
  addPlayer: jest.fn()
}));

const mockJackpotFindOneSuccess = (data: object = MOCK_BONUS_DATA): void => {
  (Jackpot.findOne as jest.Mock).mockReturnValue({
    lean: jest.fn().mockResolvedValue(data),
  });
};

const mockJackpotFindOneError = (): void => {
  Jackpot.findOne = jest.fn().mockReturnValue({
    lean: jest.fn().mockRejectedValue(new Error("DB Error")),
  });
};

const mockJackpotUpdateOneError = (): void => {
  Jackpot.updateOne = jest.fn().mockRejectedValue(new Error("DB Error"));
};

const mockGetTotalPlayersSuccess = (): void => {
  (rescueMoneyController.getTotalPlayers as jest.Mock).mockResolvedValue(TEST_DATA.TOTAL_PLAYERS);
};

const mockGetTotalPlayersError = (): void => {
  (rescueMoneyController.getTotalPlayers as jest.Mock).mockRejectedValue(new Error("DB Error"));
};

describe("Jackpot API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTotalPlayersSuccess();
  });

  describe(`GET ${ROUTE.BASE}`, () => {
    describe("Success Cases", () => {
      test("should return bonus amount as plain text when bonus data exists", async() => {
        mockJackpotFindOneSuccess();

        const response = await createRequest.get(ROUTE.BASE, HTTP_STATUS.OK, false);
        expectResponse.success(response, TEST_DATA.CURRENT_BONUS.toString());
      });
    });

    describeServerErrorTests(
      {
        route: ROUTE.BASE,
        requestFn: createRequest.get,
        dbErrorCases: [
          {
            name: "Jackpot.findOne",
            mockFn: Jackpot.findOne as jest.Mock,
            setupMocks: (): void => {
              mockJackpotFindOneError();
            }
          }
        ]
      },
      expectResponse
    );
  });

  describe(`PATCH ${ROUTE.UPDATE}`, () => {
    describeValidationErrorTests(
      {
        route: ROUTE.UPDATE,
        validBody: MOCK_UPDATE_WIN_TRUE,
        requestFn: createRequest.patch
      },
      expectResponse
    );

    describe("Success Cases", () => {
      test("should update bonus when 'win' is true", async() => {
        mockJackpotFindOneSuccess();

        const response = await createRequest.patch(
          ROUTE.UPDATE,
          MOCK_UPDATE_WIN_TRUE,
          HTTP_STATUS.OK,
          true,
          false
        );
        expectResponse.success(response, TEST_DATA.RESET_BONUS.toString());
      });

      test("should update bonus when 'win' is false", async() => {
        mockJackpotFindOneSuccess();

        const expectedBonus = TEST_DATA.CURRENT_BONUS *  TEST_DATA.TOTAL_PLAYERS;
        const response = await createRequest.patch(
          ROUTE.UPDATE,
          MOCK_UPDATE_WIN_FALSE,
          HTTP_STATUS.OK,
          true, 
          false);
        expectResponse.success(response, expectedBonus.toString());
      });
    });

    describeServerErrorTests(
      {
        route: ROUTE.UPDATE,
        requestFn: createRequest.patch,
        requestBody: MOCK_UPDATE_WIN_FALSE,
        dbErrorCases: [
          {
            name: "Jackpot.findOne",
            mockFn: Jackpot.findOne as jest.Mock,
            setupMocks: (): void => {
              mockJackpotFindOneError();
            }
          },
          {
            name: "rescueMoneyController.getTotalPlayers",
            mockFn: rescueMoneyController.getTotalPlayers as jest.Mock,
            setupMocks: (): void => {
              mockJackpotFindOneSuccess();
              mockGetTotalPlayersError();
            }
          },
          {
            name: "Jackpot.updateOne",
            mockFn: Jackpot.updateOne as jest.Mock,
            setupMocks: (): void => {
              mockJackpotFindOneSuccess();
              mockJackpotUpdateOneError();
            }
          }
        ]
      },
      expectResponse
    );
  });
});