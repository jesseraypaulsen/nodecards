import { findEventType } from "../utils";

export const graphController = (send) => {
  const handlers = {
    nodecard: (e) => {
      send({ type: "decidePath", id: e.nodes[0] });
      console.log(e)
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
