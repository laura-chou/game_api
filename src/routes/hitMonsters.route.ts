import * as hitMonstersController from "../controllers/hitMonsters.controller";

import { createRoute, RouteConfig } from "./route.utils";

export const hitMonstersRoutes = (): RouteConfig => {
  return createRoute("/hit-monsters", (router) => {
    router.get("/", hitMonstersController.getPlayers);
    router.get("/top5", hitMonstersController.getTopFive);
    router.post("/create", hitMonstersController.createPlayer);
  });
};