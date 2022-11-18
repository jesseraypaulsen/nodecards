import { typeofSelection } from "../utils"


export const graphController = (send) => {

  const handlers = { 
    BG: (e) => {
      send({ type: "CLICK.BACKGROUND", data: e })
    },
    NC: (e) => {
      send({ type: "CARD.CLICK", id: e.nodes[0] })      
    }
  }

  return (e) => {
    const eventType = typeofSelection(e)
    handlers[eventType](e)
  }
}