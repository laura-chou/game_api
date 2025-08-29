
import { jackpotRoutes } from "./jackpot.route";
import { rescueMoneyRoutes } from "./rescueMoney.route";
import { RouteConfig } from "./route.utils";

const protectedRoutes: Array<RouteConfig> = [
  rescueMoneyRoutes(),
  jackpotRoutes()
];

export default protectedRoutes;
