import JackpotController from "../controllers/jackpot.controller"
import Route from "./route"

class JackpotRoute extends Route {
  private jackpotController = new JackpotController()
  
  constructor() {
    super()
    this.setRoutes()
    this.setPrefix()
  }

  protected setRoutes(): void {
    this.router.get('/', this.jackpotController.getJackPot)
  }

  protected setPrefix(): void {
    this.prefix = '/jackpot'
  }
}