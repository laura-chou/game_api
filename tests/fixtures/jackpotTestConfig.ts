import { IJackpot } from "../../src/models/jackpot.model";

const base = "/jackpot";

type JackpotUpdate = {
  win: boolean;
}

export const ROUTE = {
  BASE: base,
  UPDATE: `${base}/update`
} as const;
  
export const TEST_DATA = {
  CURRENT_BONUS: 8888880,
  RESET_BONUS: 888888,
  TOTAL_PLAYERS: 10
} as const;

export const MOCK_BONUS_DATA: IJackpot = { bonus: TEST_DATA.CURRENT_BONUS, date: new Date() };

export const MOCK_UPDATE_WIN_TRUE : JackpotUpdate = { win: true };

export const MOCK_UPDATE_WIN_FALSE : JackpotUpdate = { win: false };