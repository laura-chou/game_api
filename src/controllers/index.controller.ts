import { Request, Response } from "express"

class IndexController {
  getResponse = (request: Request, response: Response): void => {
    response.status(200).send()
  }
}

export default IndexController