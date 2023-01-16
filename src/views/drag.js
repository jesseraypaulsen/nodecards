export default (container) => (card) => {
  let move = true;

  container.addEventListener(
    "mouseup",
    (e) => {
      move = false;
    },
    { once: true } // remove listener after it runs once
  );
  const addDeltas = (get, dx, dy) => {
    let { x, y } = get();
    return { x: x + dx, y: y + dy };
  };
  container.addEventListener("mousemove", moveHandler);
  function moveHandler(e) {
    let dx = e.movementX * 1.6; //the 1.6 factor is a crude hack that compensates for a delay between mouse and element position.
    let dy = e.movementY * 1.6; //the movementX/movementY properties on the event object return the difference between successive mouse positions.
    if (move) {
      // nodecard.js
      const domPosition = addDeltas(card.getDomPosition, dx, dy);
      console.log("drag -> domPosition: ", domPosition);
      const canvasPosition = addDeltas(card.getCanvasPosition, dx, dy);
      // library-wrappers.js
      // setDOMPosition({
      //   x: domPosition.x + dx,
      //   y: domPosition.y + dy,
      //   id,
      // });
      // setCanvasPosition({
      //   x: canvasPosition.x + dx,
      //   y: canvasPosition.y + dy,
      //   id,
      // });
      card.sendToCardMachine({
        type: "setDOMPosition",
        id: card.getId(),
        domPosition,
      });
      card.sendToCardMachine({
        type: "setCanvasPosition",
        id: card.getId(),
        canvasPosition,
      });
      card.activeFace.move();
    } else {
      container.removeEventListener("mousemove", moveHandler);
    }
  }
};
