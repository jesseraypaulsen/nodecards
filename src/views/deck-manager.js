export default function DeckManager(cardFace) {
  const nodecards = [];
  const links = [];

  const addCard = (card) => {
    nodecards.push(card);
  };
  const getCard = (id) => nodecards.find((card) => card.getId() === id);

  const removeCard = (id) => {
    nodecards = [...nodecards.filter((card) => card.getId() !== id)];
  };

  const parentEffects = {
    destroy: (id) => {
      getCard(id).activeFace.discard();
      removeCard(id);
    },
    hydrateCard: ({ id, label, text, send }) => {
      addCard(cardFace({ id, label, text, send }));
    },
    createCard: ({ id, domPosition, canvasPosition, send }) => {
      addCard(
        cardFace({
          id,
          domPosition,
          canvasPosition,
          send,
        })
      );
    },
  };

  const childEffects = {
    setDOMPosition: () => {
      getCard(id).setDomPosition(domPosition);
    },
    cardActivated: () => {
      getCard(id).inertFace.activate();
    },
    cardDeactivated: () => {
      getCard(id).activeFace.inertify();
    },
    READ: () => {
      getCard(id).activeFace.renderReader();
    },
    EDIT: () => {
      getCard(id).activeFace.renderEditor();
    },
    TYPING: () => {
      const card = getCard(id);
      card.setText(childEvent.data.text);
      card.activeFace.updateEditor();
    },
    DESTROY: () => {
      getCard(id).activeFace.discard();
      removeCard(id);
    },
  };

  // this function will be injected into the onTransition method for each card machine.
  // it will also operate within the render function for creation and destruction of cards.
  // It completely replaces renderNodecard.
  // NOTE: you have to pass 'send' in with the data obj for hydrateCard/createCard (and not thru the factory),
  // otherwise you've got a chicken/egg problem.
  return {
    outerEffect: (action, data) => {
      parentEffects[action](data);
    },
    innerEffect: (action, data) => {
      childEffects[action](data);
    },
  };
}
