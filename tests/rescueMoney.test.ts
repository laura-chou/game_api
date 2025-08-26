import { HTTP_STATUS } from "../src/common/constants";
import rescueMoney from "../src/models/rescueMoney.model";

import { MOCK_FORMATTED_DATA, MOCK_RAW_DATA, ROUTE } from "./fixtures/rescueMoneyTestConfig";
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

      // test("should return no data when player data is 0 or not found", async () => {
      //   const { sortMock, leanMock } = mockFindSortLean<T>(model, { resolve: [] });

      //   const response = await createRequest.get(route, HTTP_STATUS.OK);

      //   expectResponse.noData(response);
      // });
    });
  });
});