import * as indexController from "../controllers/index.controller";

import { createRoute, RouteConfig } from "./route.utils";

/**
 * @openapi
 * /:
 *   get:
 *     description: Get initial response
 *     responses:
 *       200:
 *         description: Returns a success message.
 */
export const indexRoute = (): RouteConfig => {
  return createRoute("/", (router) => {
    router.get("/", indexController.getResponse);
  });
};