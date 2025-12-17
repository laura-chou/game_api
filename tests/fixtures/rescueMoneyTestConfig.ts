import { IPlayerFormattedData } from "../../src/controllers/rescueMoney.controller";

const base = "/rescue-money";

export const ROUTE = {
  BASE: base,
  TOP5: `${base}/top5`,
  CREATE: `${base}/create`
} as const;

type IRawDataItem = {
  player: string;
  money: string; 
}

export const MOCK_RAW_DATA: IRawDataItem[] = [
  { player: "test1", money: "1000" },
  { player: "test2", money: "2000" },
  { player: "test3", money: "3000" },
  { player: "test4", money: "1000" },
  { player: "test5", money: "2000" },
  { player: "test6", money: "100" },
  { player: "test7", money: "200" },
  { player: "test8", money: "300" },
  { player: "test9", money: "400" },
  { player: "test10", money: "500" },
  { player: "test2", money: "2000" },
  { player: "newPlayer", money: "3500" }
];

export const MOCK_NEW_TOP_PLAYER: IRawDataItem = { player: "newPlayer", money: "3500" };

export const MOCK_NEW_EXTRA_PLAYER: IRawDataItem = { player: "newPlayer2", money: "100" };

export const MOCK_FORMATTED_DATA: IPlayerFormattedData[] = [
  { rank: 1, money: "3500", players: ["newPlayer"] },
  { rank: 2, money: "3000", players: ["test3"] },
  { rank: 3, money: "2000", players: ["test2", "test5"] },
  { rank: 4, money: "1000", players: ["test1", "test4"] },
  { rank: 5, money: "500", players: ["test10"] },
  { rank: 6, money: "400", players: ["test9"] },
  { rank: 7, money: "300", players: ["test8"] },
  { rank: 8, money: "200", players: ["test7"] },
  { rank: 9, money: "100", players: ["test6"] }
];

export const MOCK_FORMATTED_TOP5: IPlayerFormattedData[] = MOCK_FORMATTED_DATA.slice(0, 5);

export const MOCK_DISTINCT_PLAYERS: string[] = ["player1", "player2", "player3"];