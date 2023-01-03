function graphPositioners(network) {
  const convertCanvasPositionToDOM = (canvasPosition) =>
    network.canvasToDOM(canvasPosition);

  const convertDOMPositionToCanvas = (domPosition) =>
    network.DOMtoCanvas(domPosition);

  const getCanvasPositionFromGraph = (id) => network.getPosition(id);

  return {
    convertCanvasPositionToDOM,
    convertDOMPositionToCanvas,
    getCanvasPositionFromGraph,
  };
}

function statePositioners(send) {
  const setCanvasPosition = (canvasPosition) =>
    send({ type: "setCardCanvasPosition", canvasPosition });

  const setDOMPosition = (domPosition) =>
    send({ type: "setCardDOMPosition", domPosition });

  return {
    setCanvasPosition,
    setDOMPosition,
  };
}

function positionUtilities() {
  const updateCanvasPositionFromDOM = (domPosition) => {
    setCanvasPosition(convertDOMPositionToCanvas(domPosition));
  };

  const updateDOMPositionFromCanvas = (canvasPosition) => {
    setDOMPosition(convertCanvasPositionToDOM(canvasPosition));
  };

  //TODO: function for init, that calls getCanvasPositionFromGraph and feeds output to a function that sets position into card machine context,
  // and fires an event, upon which another function is called that updates the domPosition in the card machine's context.
  // then we have to synchronize this data with the corresponding values in the nodecard instance. only when both domPosition and canvasPosition
  // are updated, in both card machine and nodecard, do we render/re-render the nodecard on both graph and DOM.

  return {
    updateCanvasPositionFromDOM,
    updateDOMPositionFromCanvas,
  };
}
