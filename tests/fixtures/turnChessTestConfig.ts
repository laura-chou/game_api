const base = "/turn-chess";

export const ROUTE = {
  BASE: base,
  TOP5: `${base}/top5`,
  CREATE: `${base}/create`
} as const;

type IRawDataItem = {
  character: number;
  player: string;
  score: number;
  spentTime: string;
  message: string;
}

interface IFormattedPlayer {
  character: number;
  player: string;
  score: number;
  message: string;
}

interface IFormattedDataItem {
  rank: number;
  spentTime: string;
  players: IFormattedPlayer[];
}

export const MOCK_RAW_DATA: IRawDataItem[] = [
  { character: 1, player: "test1", score: 10, spentTime: "13:00", message: "Test message 1" },
  { character: 1, player: "test2", score: 16, spentTime: "13:00", message: "Test message 2" },
  { character: 2, player: "test3", score: 16, spentTime: "13:00", message: "Test message 3" },
  { character: 2, player: "test4", score: 9, spentTime: "10:00", message: "Test message 4" },
  { character: 3, player: "test5", score: 11, spentTime: "11:52", message: "Test message 5" },
  { character: 3, player: "test6", score: 15, spentTime: "13:00", message: "Test message 6" },
  { character: 4, player: "test7", score: 12, spentTime: "20:21", message: "Test message 7" },
  { character: 4, player: "test8", score: 11, spentTime: "20:30", message: "Test message 8" },
  { character: 4, player: "test9", score: 14, spentTime: "20:40", message: "Test message 9" },
  { character: 1, player: "test10", score: 9, spentTime: "21:33", message: "Test message 10" },
  { character: 3, player: "test2", score: 9, spentTime: "21:34", message: "Test message 11" },
  { character: 2, player: "newPlayer", score: 10, spentTime: "15:47", message: "New top player!" }
];

export const MOCK_NEW_TOP_PLAYER: IRawDataItem = {
  character: 2,
  player: "newPlayer",
  score: 10,
  spentTime: "15:47",
  message: "New top player!"
};

export const MOCK_NEW_EXTRA_PLAYER: IRawDataItem = {
  character: 1,
  player: "newPlayer2",
  score: 10,
  spentTime: "15:47",
  message: ""
};

export const MOCK_FORMATTED_DATA: IFormattedDataItem[] = [
  { 
    rank: 1,
    spentTime: "10:00",
    players: [
      {
        character: 2,
        player: "test4",
        score: 9,
        message: "Test message 4"
      }
    ]
  },
  { 
    rank: 2, 
    spentTime: "11:52", 
    players: [
      {
        character: 3,
        player: "test5",
        score: 11,
        message: "Test message 5"
      }
    ] 
  },
  { 
    rank: 3, 
    spentTime: "13:00", 
    players: [
      {
        character: 1,
        player: "test2",
        score: 16,
        message: "Test message 2"
      },
      {
        character: 2,
        player: "test3",
        score: 16,
        message: "Test message 3"
      },
      {
        character: 3,
        player: "test6",
        score: 15,
        message: "Test message 6"
      },
      {
        character: 1,
        player: "test1",
        score: 10,
        message: "Test message 1"
      }
    ] 
  },
  { 
    rank: 4, 
    spentTime: "15:47", 
    players: [
      {
        character: 2,
        player: "newPlayer",
        score: 10,
        message: "New top player!"
      }
    ] 
  },
  { 
    rank: 5, 
    spentTime: "20:21", 
    players: [
      {
        character: 4,
        player: "test7",
        score: 12,
        message: "Test message 7"
      }
    ] 
  },
  { 
    rank: 6, 
    spentTime: "20:30", 
    players: [
      {
        character: 4,
        player: "test8",
        score: 11,
        message: "Test message 8"
      }
    ] 
  },
  { 
    rank: 7, 
    spentTime: "20:40", 
    players: [
      {
        character: 4,
        player: "test9",
        score: 14,
        message: "Test message 9"
      }
    ] 
  },
  { 
    rank: 8, 
    spentTime: "21:33", 
    players: [
      {
        character: 1,
        player: "test10",
        score: 9,
        message: "Test message 10"
      }
    ] 
  },
  { 
    rank: 9, 
    spentTime: "21:34", 
    players: [
      {
        character: 3,
        player: "test2",
        score: 9,
        message: "Test message 11"
      }
    ] 
  }
];

export const MOCK_FORMATTED_TOP5: IFormattedDataItem[] = MOCK_FORMATTED_DATA.slice(0, 5);