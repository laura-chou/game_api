import * as hitMonstersController from "../controllers/hitMonsters.controller";

import { createRoute, RouteConfig } from "./route.utils";

/**
 * @openapi
 * /hit-monsters:
 *   get:
 *     description: Get all players
 *     responses:
 *       200:
 *         description: Returns a list of all players.
 * /hit-monsters/top5:
 *   get:
 *     description: Get top 5 players
 *     responses:
 *       200:
 *         description: Returns the top 5 players.
 * /hit-monsters/create:
 *   post:
 *     description: Create a new player record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - player
 *               - spentTime
 *             properties:
 *               player:
 *                 type: string
 *               spentTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Player created successfully.
 */
export const hitMonstersRoutes = (): RouteConfig => {
  return createRoute("/hit-monsters", (router) => {
    router.get("/", hitMonstersController.getPlayers);
    router.get("/top5", hitMonstersController.getTopFive);
    router.post("/create", hitMonstersController.createPlayer);
  });
};