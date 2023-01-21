import { findEventType } from "../utils";

export const graphController = (send) => {
  const handlers = {
    background: (e) => {
      send({
        type: "clickedBackground",
        x: e.pointer.DOM.x,
        y: e.pointer.DOM.y,
      });
    },
    nodecard: (e) => {
      send({ type: "decidePath", id: e.nodes[0] });
    },
    link: (e) => {
      send({ type: "clickedLink", e });
    },
  };

  return (e) => {
    const eventType = findEventType(e);
    handlers[eventType](e);
  };
};
