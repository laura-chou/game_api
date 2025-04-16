import 'dotenv/config'
import  express, { Express, Request, Response, NextFunction } from 'express'
import { convertToBool, isNullOrEmpty } from './common';
import cors, { CorsOptions } from 'cors'

const app: Express = express()
const whitelist: string[] = process.env.WHITELIST?.split(',') || []

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || whitelist.includes(origin) || convertToBool(process.env.ALLOW_CORS)) {
      // logger.info(`origin: ${origin}`)
      callback(null, true);
    } else {
      const msg = 'Not allowed by CORS';
       // logger.error(`origin: ${origin} ${msg}`)
      callback(new Error(msg));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (!isNullOrEmpty(error.message)) {
    // sendResponse(res, 403, 'error', 'CORS policy does not allow access from this origin.')
    return
  }
  // logger.info(`Path: ${req.originalUrl}`)
  next()
})

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`)
})
// app.get('/', (request: Request, response: Response) => {
//   response.type('text/plain');
//   response.send('Homepage');
// })

// app.post('/articles', (request: Request, response: Response) => {
//   response.type('text/plain');
//   response.send('All articles are here!');
// })
