import * as jackpotController from "../controllers/jackpot.controller";

import { createRoute, RouteConfig } from "./route.utils";

export const jackpotRoutes = (): RouteConfig => {
  return createRoute("/jackpot", (router) => {
    router.get("/", jackpotController.getJackPot);
    router.patch("/update", jackpotController.updateJackPot);
  });
};