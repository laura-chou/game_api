import * as indexController from "@/controllers/index.controller";
import { createRoute, RouteConfig } from "@/routes/route.utils";

export const indexRoute = (): RouteConfig => {
  return createRoute("/", (router) => {
    router.get("/", indexController.getResponse);
  });
};