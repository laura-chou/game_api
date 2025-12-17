import { IPlayerFormattedData } from "../../src/controllers/hitMonsters.controller";

const base = "/hit-monsters";

export const ROUTE = {
  BASE: base,
  TOP5: `${base}/top5`,
  CREATE: `${base}/create`
} as const;

type IRawDataItem = {
  player: string;
  spentTime: string; 
}

export const MOCK_RAW_DATA: IRawDataItem[] = [
  { player: "test1", spentTime: "01:00" },
  { player: "test2", spentTime: "00:55" },
  { player: "test3", spentTime: "00:45" },
  { player: "test4", spentTime: "01:00" },
  { player: "test5", spentTime: "00:55" },
  { player: "test6", spentTime: "03:40" },
  { player: "test7", spentTime: "03:00" },
  { player: "test8", spentTime: "02:50" },
  { player: "test9", spentTime: "02:20" },
  { player: "test10", spentTime: "01:20" },
  { player: "test2", spentTime: "00:55" },
  { player: "newPlayer", spentTime: "00:35" }
];

export const MOCK_NEW_TOP_PLAYER: IRawDataItem = { player: "newPlayer", spentTime: "00:35" };

export const MOCK_NEW_EXTRA_PLAYER: IRawDataItem = { player: "newPlayer2", spentTime: "03:00" };

export const MOCK_FORMATTED_DATA: IPlayerFormattedData[] = [
  { rank: 1, spentTime: "00:35", players: ["newPlayer"] },
  { rank: 2, spentTime: "00:45", players: ["test3"] },
  { rank: 3, spentTime: "00:55", players: ["test2", "test5"] },
  { rank: 4, spentTime: "01:00", players: ["test1", "test4"] },
  { rank: 5, spentTime: "01:20", players: ["test10"] },
  { rank: 6, spentTime: "02:20", players: ["test9"] },
  { rank: 7, spentTime: "02:50", players: ["test8"] },
  { rank: 8, spentTime: "03:00", players: ["test7"] },
  { rank: 9, spentTime: "03:40", players: ["test6"] }
];

export const MOCK_FORMATTED_TOP5: IPlayerFormattedData[] = MOCK_FORMATTED_DATA.slice(0, 5);