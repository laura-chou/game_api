
import { rescueMoneyRoutes } from "./rescueMoney.route";
import { RouteConfig } from "./route.utils";

const protectedRoutes: Array<RouteConfig> = [
  rescueMoneyRoutes()
];

export default protectedRoutes;
