import * as turnChessController from "../controllers/turnChess.controller";

import { createRoute, RouteConfig } from "./route.utils";

/**
 * @openapi
 * /turn-chess:
 *   get:
 *     description: Get all turn chess players
 *     responses:
 *       200:
 *         description: Returns a list of all turn chess players.
 * /turn-chess/top5:
 *   get:
 *     description: Get top 5 turn chess players
 *     responses:
 *       200:
 *         description: Returns the top 5 turn chess players.
 * /turn-chess/create:
 *   post:
 *     description: Create a new turn chess player record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - player
 *               - spentTime
 *               - character
 *               - score
 *             properties:
 *               player:
 *                 type: string
 *               spentTime:
 *                 type: string
 *               character:
 *                 type: integer
 *               score:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Player created successfully.
 */
export const turnChessRoutes = (): RouteConfig => {
  return createRoute("/turn-chess", (router) => {
    router.get("/", turnChessController.getPlayers);
    router.get("/top5", turnChessController.getTopFive);
    router.post("/create", turnChessController.createPlayer);
  });
};