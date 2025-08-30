
import { jackpotRoutes } from "./jackpot.route";
import { rescueMoneyRoutes } from "./rescueMoney.route";
import { RouteConfig } from "./route.utils";
import { turnChessRoutes } from "./turnChess.route";

const protectedRoutes: Array<RouteConfig> = [
  rescueMoneyRoutes(),
  jackpotRoutes(),
  turnChessRoutes()
];

export default protectedRoutes;
