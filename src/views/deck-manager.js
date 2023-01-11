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
    setDOMPosition: ({ id, domPosition }) => {
      getCard(id).setDomPosition(domPosition);
    },
    setCanvasPosition: ({ id, canvasPosition }) => {
      getCard(id).setCanvasPosition(canvasPosition);
    },
    cardActivated: ({ id }) => {
      getCard(id).inertFace.activate();
    },
    cardDeactivated: ({ id }) => {
      getCard(id).activeFace.inertify();
    },
    READ: ({ id }) => {
      getCard(id).activeFace.renderReader();
    },
    EDIT: ({ id }) => {
      getCard(id).activeFace.renderEditor();
    },
    TYPING: ({ id, text }) => {
      const card = getCard(id);
      console.log("card and id -> ", card, id);
      card.setText(text);
      card.activeFace.updateEditor();
    },
    DESTROY: ({ id }) => {
      getCard(id).activeFace.discard();
      removeCard(id);
    },
  };

  const isValid = (o, action) => Object.keys(o).find((key) => key === action);

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
      console.log("childEffects - ", action, data);
      const valid = isValid(childEffects, action);
      console.log("valid ", valid);
      if (valid) childEffects[action](data);
    },
  };
}
