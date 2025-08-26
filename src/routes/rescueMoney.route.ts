import * as rescueMoneyController from "../controllers/rescueMoney.controller";

import { createRoute, RouteConfig } from "./route.utils";

export const rescueMoneyRoutes = (): RouteConfig => {
  return createRoute("/rescue-money", (router) => {
    router.get("/", rescueMoneyController.getPlayers);
    // router.get("/top5", rescueMoneyController.getTopFive);
    // router.post("/player", rescueMoneyController.addPlayer);
  });
};