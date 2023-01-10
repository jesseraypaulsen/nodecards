function DeckManager(cardFace) {
  const nodecards = [];
  const links = [];

  const addCard = (card) => {
    nodecards.push(card);
  };
  const getCard = (id) => nodecards.find((card) => card.getId() === id);

  const removeCard = (id) => {
    nodecards = [...nodecards.filter((card) => card.getId() !== id)];
  };

  const createCard = ({
    id,
    domPosition,
    canvasPosition,
    send,
    machineRef,
  }) => {
    addCard(
      cardFace({
        id,
        domPosition,
        canvasPosition,
        send,
        machineRef,
      })
    );
  };

  const hydrateCard = ({ id, label, text, send, machineRef }) => {
    addCard(cardFace({ id, label, text, send, machineRef }));
  };

  const destroy = (id) => {
    getCard(id).activeFace.discard();
    removeCard(id);
  };

  // this function will be injected into the onTransition method for each card machine.
  // it will also operate within the render function for creation and destruction of cards.
  // And it might completely replace renderNodecard.
  return (id, action, data) => {};
}
