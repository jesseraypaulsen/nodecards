export default (container, cardFuncs) => {
  let move = true;
  const stopMoving = () => (move = false);
  const onlyRunOnce = { once: true };
  container.addEventListener("mouseup", stopMoving, onlyRunOnce);
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
  let dx = e.movementX;
  let dy = e.movementY;
  return { dx, dy };
};

function moveCard({ getDomPosition, getCanvasPosition, id, send }, e) {
  const domPosition = addDeltas(getDomPosition(), getDeltas(e));
  const canvasPosition = addDeltas(getCanvasPosition(), getDeltas(e));

  send({ type: "setCardDOMPosition", id, domPosition });
  send({ type: "setCardCanvasPosition", id, canvasPosition });
  //send({ type: "mediate", childType: "MOVE", data: { id } });
}
