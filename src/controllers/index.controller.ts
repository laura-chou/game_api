import { Request, Response, NextFunction } from "express"

class IndexController {
  getResponse(request: Request, response: Response, next: NextFunction) {
    response.status(200).send()
  }
}

export default IndexController



