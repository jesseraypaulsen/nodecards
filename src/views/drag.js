function drag(e, card) {
  e.preventDefault(); // required in order to fire/catch the mouseup event. Why? No idea.
  turnPhysicsOff(); // physics must be turned off for dragging to work.
  let move = true;

  const container = card.app.container;
  container.addEventListener(
    "mouseup",
    (e) => {
      move = false;
    },
    { once: true }
  ); // the last arg removes event listener after it runs once

  container.addEventListener("mousemove", moveHandler);
  function moveHandler(e) {
    let dx = e.movementX * 1.6; //the 1.6 factor is a crude hack that compensates for a delay between mouse and element position.
    let dy = e.movementY * 1.6; //the movementX/movementY properties on the event object return the difference between successive mouse positions.
    if (move) {
      const pos = card.getNodeCenter();

      card.app.graphRenderer.moveNode(card.id, pos.canX + dx, pos.canY + dy);
      card.setPosition(pos.domX + dx, pos.domY + dy);
      // using Nodecard.prototype.move() causes internal error in vis-network/BarnesHutSolver.js,"too much recursion"
    } else {
      container.removeEventListener("mousemove", moveHandler);
    }
  }
}
