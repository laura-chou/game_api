import "dotenv/config";
import cors, { CorsOptions } from "cors";
import express, { json, urlencoded, Express, Request, Response, NextFunction } from "express";
import morgan, { token } from "morgan";

import { isJestTest, isNullOrEmpty } from "../src/common/utils";
import { connectDB } from "../src/core/db";
import { LogLevel, setLog } from "../src/core/logger";
import protectedRoutes from "../src/routes/protected.routes";

import { responseHandler } from "./common/response";

const app: Express = express();
const whiteList: string[] = process.env.WHITELIST?.split(",") || [];
const loggedOrigins = new Set<string>();

token("apiPath", (req: Request) => `${req.method} ${req.originalUrl}`);
app.use(morgan(":apiPath", {
  immediate: true,
  stream: {
    write: (message: string) => {
      setLog(LogLevel.HTTP, message.trim());
    }
  }
}));

app.use(json());
app.use(urlencoded({ extended: true }));

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (isJestTest) {
      callback(null, true);
    }
    if (!isNullOrEmpty(origin)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const hostName: string = new URL(origin!).hostname;

      if (!loggedOrigins.has(hostName)) {
        setLog(LogLevel.INFO, `origin: ${origin}`);
        loggedOrigins.add(hostName);
      }

      callback(null, whiteList.includes(hostName));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  if (!isNullOrEmpty(error.message)) {
    setLog(LogLevel.ERROR, error.message);
    responseHandler.forbidden(response);
  } else {
    setLog(LogLevel.ERROR, `Unhandled error:\n ${error}`);
    responseHandler.serverError(response);
  }
});

protectedRoutes.forEach(route => {
  app.use(route.prefix, route.router);
});

if (!isJestTest) connectDB();

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`http://localhost:${process.env.PORT}`);
});

export default app;