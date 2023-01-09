export const renderNodecard = (childState) => {
  const childEvent = childState.event;
  let { id, label, text, domPosition, canvasPosition } = childState.context;

  //if (childEvent.type === "xstate.init")
  const card = getCard(id);

  if (childEvent.type === "cardActivated") {
    //TODO: card.setDomPosition should be called immediately after the card machine is updated with a new domPosition
    card.setDomPosition(domPosition);
    card.inertFace.activate();
  }

  if (childEvent.type === "cardDeactivated") card.activeFace.inertify();

  //if (childState.changed && childState.matches("active.read")) -> BREAKING! called before cardActivated, precluding the creation of the dom element!
  if (childEvent.type === "SWITCH.READ") {
    card.activeFace.renderReader();
  }
  if (childState.changed && childState.matches("active.edit")) {
    //if (childEvent.type === "SWITCH.EDIT")
    card.activeFace.renderEditor();
  }

  if (childEvent.type === "TYPING") {
    card.setText(childEvent.text);
    card.activeFace.updateEditor(); // controlled element
  }
  if (childEvent.type === "DELETE") {
    card.activeFace.discard();
    destroyCard(id);
  }
};
