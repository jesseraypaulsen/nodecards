import { typeofSelection } from "../utils";

export const graphController = (send) => {
  const handlers = {
    BG: (e) => {
      send({
        type: "CLICK.BACKGROUND",
        x: e.pointer.DOM.x,
        y: e.pointer.DOM.y,
      });
    },
    NC: (e) => {
      send({
        type: "CARD.CLICK",
        id: e.nodes[0],
        x: e.pointer.DOM.x,
        y: e.pointer.DOM.y,
      });
    },
  };

  return (e) => {
    const eventType = typeofSelection(e);
    handlers[eventType](e);
  };
};
