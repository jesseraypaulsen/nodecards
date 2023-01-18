export default (network, send) => {
  // vis-network adapters

  const canvasToDOM = (canvasPosition) => network.canvasToDOM(canvasPosition);
  const DOMtoCanvas = (domPosition) => network.DOMtoCanvas(domPosition);
  const getCanvasPosition = (id) => network.getPosition(id);

  // XState adapters

  const setCanvasPosition = ({ canvasPosition, ...args }) =>
    send({ type: "setCardCanvasPosition", canvasPosition, ...args });

  const setDOMPosition = ({ domPosition, ...args }) => {
    send({ type: "setCardDOMPosition", domPosition, ...args });
  };

  const createCard = ({ ...args }) => send({ type: "__createCard__", ...args });

  const hydrateCard = ({ ...args }) =>
    send({ type: "__hydrateCard__", ...args });

  const hydrateLink = ({ ...args }) => send({ type: "hydrateLink", ...args });

  //const removeLink = ({ ...args }) => send({ type: "removeLink", ...args });

  // facades

  const setPositionAfterCreation = (id, delay) => {
    // delay until after the machine transitions from mode.intializing to mode.active, so that physics engine is turned off.
    // otherwise the position data will not be accurate.
    setTimeout(() => {
      let canvasPosition = getCanvasPosition(id);
      let domPosition = canvasToDOM({
        x: canvasPosition.x,
        y: canvasPosition.y,
      });
      setDOMPosition({ domPosition, id });
      setCanvasPosition({ canvasPosition, id });
    }, delay);
  };

  const calculatePositionThenCreate = (id, label, text, domPosition) => {
    const canvasPosition = DOMtoCanvas({
      x: domPosition.x,
      y: domPosition.y,
    });

    createCard({
      label,
      text,
      domPosition,
      canvasPosition,
      id,
    });
  };

  return {
    hydrateCard,
    hydrateLink,
    //removeLink,
    setPositionAfterCreation,
    calculatePositionThenCreate,
  };
};
