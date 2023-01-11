export default function DeckManager(cardFace) {
  let nodecards = [];
  let links = [];

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
      send({ type: "mediate", childType: "activate", id });
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
      card.setText(text);
      card.activeFace.updateEditor();
    },
    DESTROY: ({ id }) => {
      getCard(id).activeFace.discard();
      removeCard(id);
    },
  };

  const isValid = (o, action) => Object.keys(o).find((key) => key === action);

  return {
    outerEffect: (action, data) => {
      console.log("innerEffect -> ", action, data);

      const valid = isValid(childEffects, action);
      console.log("valid ", valid);
      parentEffects[action](data);
      //if (valid) parentEffects[action](data); TODO: why does testing for valid cause a bug here? and why does its absence NOT cause bugs?
    },
    innerEffect: (action, data) => {
      console.log("innerEffect -> ", action, data);
      const valid = isValid(childEffects, action);
      console.log("valid ", valid);
      if (valid) childEffects[action](data);
    },
  };
}
