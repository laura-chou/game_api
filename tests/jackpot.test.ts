import { HTTP_STATUS } from "../src/common/constants";
import Jackpot from "../src/models/jackpot.model";

import { MOCK_BONUS_DATA, ROUTE, TEST_DATA } from "./fixtures/jackpotTestConfig";
import { describeServerErrorTests } from "./fixtures/testStructures";
import { createRequest, expectResponse } from "./fixtures/testUtils";

jest.mock("../src/models/jackpot.model", () => ({
  findOne: jest.fn()
}));

describe("Jackpot API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe(`GET ${ROUTE.BASE}`, () => {
    describe("Success Cases", () => {
      test("should return bonus amount as plain text when bonus data exists", async() => {
        (Jackpot.findOne as jest.Mock).mockReturnValue({
          lean: jest.fn().mockResolvedValue(MOCK_BONUS_DATA),
        });

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
              Jackpot.findOne = jest.fn().mockReturnValue({
                lean: jest.fn().mockRejectedValue(new Error("DB Error")),
              });
            }
          }
        ]
      },
      expectResponse
    );
  });
});