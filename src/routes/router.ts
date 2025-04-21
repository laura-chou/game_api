import Route from "./route"
import IndexRoute from "./index.route"
import JackpotRoute from "./jackpot.route"

export const router: Array<Route> = [
  new IndexRoute(),
  new JackpotRoute()
]
