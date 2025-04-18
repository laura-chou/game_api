import { Router } from "express"

abstract class Route {
  protected router: Router = Router()
  protected prefix: string = "";
  
  protected abstract setRoutes(): void
  protected abstract setPrefix(): void

  public getRouter(): Router {
    return this.router
  }

  public getPrefix(): string {
    return this.prefix;
  }
}

export default Route
