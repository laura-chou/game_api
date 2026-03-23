import * as rescueMoneyController from "../controllers/rescueMoney.controller";

import { createRoute, RouteConfig } from "./route.utils";

/**
 * @openapi
 * /rescue-money:
 *   get:
 *     description: Get all rescue money players
 *     responses:
 *       200:
 *         description: Returns a list of all rescue money players.
 * /rescue-money/top5:
 *   get:
 *     description: Get top 5 rescue money players
 *     responses:
 *       200:
 *         description: Returns the top 5 rescue money players.
 * /rescue-money/create:
 *   post:
 *     description: Create a new rescue money player record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - player
 *               - money
 *             properties:
 *               player:
 *                 type: string
 *               money:
 *                 type: string
 *     responses:
 *       200:
 *         description: Player created successfully.
 */
export const rescueMoneyRoutes = (): RouteConfig => {
  return createRoute("/rescue-money", (router) => {
    router.get("/", rescueMoneyController.getPlayers);
    router.get("/top5", rescueMoneyController.getTopFive);
    router.post("/create", rescueMoneyController.createPlayer);
  });
};