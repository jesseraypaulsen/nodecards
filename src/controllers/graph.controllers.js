import { findEventType } from "../utils";

export const graphController = (send) => {
  const handlers = {
    // background: (e) => {
    //   send({
    //     type: "clickedBackground",
    //     x: e.pointer.DOM.x,
    //     y: e.pointer.DOM.y,
    //   });
    // },
    nodecard: (e) => {
      console.log("nodecard clicked: ", e.nodes[0]);
      send({ type: "decidePath", id: e.nodes[0] });
    },
    link: (e) => {
      send({ type: "openLinkPrompt", id: e.edges[0], pointer: e.pointer });
    },
  };

  return (e) => {
    const eventType = findEventType(e);
    if (eventType === "nodecard" || eventType === "link")
      handlers[eventType](e);
  };
};
