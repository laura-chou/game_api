import * as jackpotController from "../controllers/jackpot.controller";

import { createRoute, RouteConfig } from "./route.utils";

/**
 * @openapi
 * /jackpot:
 *   get:
 *     description: Get current jackpot
 *     responses:
 *       200:
 *         description: Returns the current jackpot values.
 * /jackpot/update:
 *   patch:
 *     description: Update jackpot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - win
 *             properties:
 *               win:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Jackpot updated successfully.
 */
export const jackpotRoutes = (): RouteConfig => {
  return createRoute("/jackpot", (router) => {
    router.get("/", jackpotController.getJackPot);
    router.patch("/update", jackpotController.updateJackPot);
  });
};