export default (container) => (card) => {
  let move = true;
  const disableMoving = () => (move = false);
  const onlyRunOnce = { once: true };
  container.addEventListener("mouseup", disableMoving, onlyRunOnce);
  container.addEventListener("mousemove", dragHandler);
  const selfDestruct = () =>
    container.removeEventListener("mousemove", dragHandler);

  function dragHandler(e) {
    if (move) {
      moveCard(card, e);
    } else {
      selfDestruct();
    }
  }
};

const addDeltas = (getPos, { dx, dy }) => {
  let { x, y } = getPos();
  return { x: x + dx, y: y + dy };
};

const getDeltas = (e) => {
  let dx = e.movementX * 1.6; //the 1.6 factor is a crude hack that compensates for a delay between mouse and element position.
  let dy = e.movementY * 1.6; //the movementX/movementY properties on the event object return the difference between successive mouse positions.
  return { dx, dy };
};

function moveCard(card, e) {
  //TODO: pass getDomPosition/getCanvasPosition from nodecard.js

  const domPosition = addDeltas(card.getDomPosition, getDeltas(e));
  const canvasPosition = addDeltas(card.getCanvasPosition, getDeltas(e));

  //TODO: send({type:"setCardDOMPosition", id}) and pass down id
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

  //but what about this?
  card.activeFace.move();
}
