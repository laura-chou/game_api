
import { hitMonstersRoutes } from "./hitMonsters.route";
import { indexRoute } from "./index.route";
import { jackpotRoutes } from "./jackpot.route";
import { rescueMoneyRoutes } from "./rescueMoney.route";
import { RouteConfig } from "./route.utils";
import { turnChessRoutes } from "./turnChess.route";

const protectedRoutes: Array<RouteConfig> = [
  indexRoute(),
  rescueMoneyRoutes(),
  jackpotRoutes(),
  turnChessRoutes(),
  hitMonstersRoutes()
];

export default protectedRoutes;
