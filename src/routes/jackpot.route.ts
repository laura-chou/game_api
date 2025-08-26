import JackpotController from "@/controllers/jackpot.controller";
import Route from "@/routes/route.utils";

class JackpotRoute extends Route {
  private jackpotController = new JackpotController();
  
  constructor() {
    super();
    this.setRoutes();
    this.setPrefix();
  }

  protected setRoutes(): void {
    this.router.get("/", this.jackpotController.getJackPot);
    this.router.patch("/update", this.jackpotController.updateJackPot);
  }

  protected setPrefix(): void {
    this.prefix = "/jackpot";
  }
}

export default JackpotRoute;