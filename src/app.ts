import "dotenv/config"
import "./db"
import  express, { Express, Request, Response, NextFunction } from "express"
import cors, { CorsOptions } from "cors"
import { convertToBool, isNullOrEmpty } from "./common"
import { LogLevel, setLog } from "./logger"
import { router } from "./routes/router"

const app: Express = express()
const whitelist: string[] = process.env.WHITELIST?.split(",") || []

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || whitelist.includes(origin) || convertToBool(process.env.ALLOW_CORS)) {
      setLog(LogLevel.INFO, `origin: ${origin}`)
      callback(null, true);
    } else {
      const msg = "Not allowed by CORS";
      setLog(LogLevel.ERROR, `origin: ${origin} ${msg}`)
      callback(new Error(msg));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (!isNullOrEmpty(error.message)) {
    // sendResponse(res, 403, "error", "CORS policy does not allow access from this origin.")
    return
  }
  setLog(LogLevel.INFO, `origin: ${req.originalUrl}`)
  next()
})

router.forEach( route => {
  app.use(route.getPrefix(), route.getRouter())
})

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`http://localhost:${process.env.PORT}`)
})
