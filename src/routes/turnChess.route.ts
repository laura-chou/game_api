import * as turnChessController from "../controllers/turnChess.controller";

import { createRoute, RouteConfig } from "./route.utils";

export const turnChessRoutes = (): RouteConfig => {
  return createRoute("/turn-chess", (router) => {
    router.get("/", turnChessController.getPlayers);
    router.get("/top5", turnChessController.getTopFive);
    router.post("/create", turnChessController.createPlayer);
  });
};