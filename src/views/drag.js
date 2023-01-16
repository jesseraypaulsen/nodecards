function drag(e, card) {
  e.preventDefault(); // required in order to fire/catch the mouseup event.
  turnPhysicsOff(); // physics must be turned off for dragging to work.
  let move = true;

  const container = card.app.container;
  container.addEventListener(
    "mouseup",
    (e) => {
      move = false;
    },
    { once: true } // remove listener after it runs once
  );

  container.addEventListener("mousemove", moveHandler);
  function moveHandler(e) {
    let dx = e.movementX * 1.6; //the 1.6 factor is a crude hack that compensates for a delay between mouse and element position.
    let dy = e.movementY * 1.6; //the movementX/movementY properties on the event object return the difference between successive mouse positions.
    if (move) {
      // nodecard.js
      const domPosition = getDomPosition();
      const canvasPosition = getCanvasPosition();
      // library-wrappers.js
      setDOMPosition({
        x: domPosition.x + dx,
        y: domPosition.y + dy,
        id,
      });
      setCanvasPosition({
        x: canvasPosition.x + dx,
        y: canvasPosition.y + dy,
        id,
      });
      //new method:
      card.activeFace.move();
      // card.moveNode(); //graph-adapter
      // setPosition(element, domPosition.x + dx, domPosition.y + dy); //dom-adapter
    } else {
      container.removeEventListener("mousemove", moveHandler);
    }
  }
}
