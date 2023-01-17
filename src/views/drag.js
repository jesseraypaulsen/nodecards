export default (container, cardFuncs) => {
  let move = true;
  const disableMoving = () => (move = false);
  const onlyRunOnce = { once: true };
  container.addEventListener("mouseup", disableMoving, onlyRunOnce);
  container.addEventListener("mousemove", dragHandler);
  const selfDestruct = () =>
    container.removeEventListener("mousemove", dragHandler);

  function dragHandler(e) {
    if (move) {
      moveCard(cardFuncs, e);
    } else {
      selfDestruct();
    }
  }
};

const addDeltas = ({ x, y }, { dx, dy }) => {
  return { x: x + dx, y: y + dy };
};

const getDeltas = (e) => {
  let dx = e.movementX * 1.6; //the 1.6 factor is a crude hack that compensates for a delay between mouse and element position.
  let dy = e.movementY * 1.6; //the movementX/movementY properties on the event object return the difference between successive mouse positions.
  return { dx, dy };
};

function moveCard({ getDomPosition, getCanvasPosition, id, send }, e) {
  const domPosition = addDeltas(getDomPosition(), getDeltas(e));
  const canvasPosition = addDeltas(getCanvasPosition(), getDeltas(e));

  send({ type: "setCardDOMPosition", id, domPosition });
  send({ type: "setCardCanvasPosition", id, canvasPosition });
  send({ type: "mediate", childType: "MOVE", id });
}
