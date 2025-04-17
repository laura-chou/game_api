import IndexController from "../controllers/index.controller"
import Route from "./route"

class IndexRoute extends Route {

  private indexController = new IndexController()

  constructor() {
    super()
    this.setRoutes()
    this.setPrefix()
  }

  protected setRoutes(): void {
    this.router.get('/', this.indexController.getResponse)
  }

  protected setPrefix(): void {
    this.prefix = '/'
  }
}

export default IndexRoute