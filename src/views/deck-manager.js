import { isValid } from "../utils.js";

export default function DeckManager(cardFace, createEdge, drag) {
  let nodecards = [];
  let links = [];

  const addCard = (card) => {
    nodecards = nodecards.concat(card);
  };
  const getCard = (id) => nodecards.find((card) => card.getId() === id);

  const addLink = (link) => {
    links = links.concat(link);
  };

  const removeLink = (id) => {
    links = [...links.filter((link) => link.id !== id)];
  };

  const getLinksForCard = (id) =>
    links.filter((link) => link.to === id || link.from === id);

  const removeLinksForCard = (id) => {
    getLinksForCard(id).map((link) => removeLink(link.id));
  };

  const removeCard = (id) => {
    removeLinksForCard(id);
    nodecards = [...nodecards.filter((card) => card.getId() !== id)];
  };

  const parentEffects = {
    /*destroyCard: ({ id }) => {
      removeCard(id);
      This fails because it gets called no matter what state the parent machine is in.
    },*/
    hydrateCard: ({ id, label, text, send, cardMachine }) => {
      addCard(
        cardFace({ id, label, text, getLinksForCard, send, cardMachine })
      );
    },
    createCard: ({
      id,
      label,
      text,
      domPosition,
      canvasPosition,
      send,
      cardMachine,
    }) => {
      addCard(
        cardFace({
          id,
          label,
          text,
          domPosition,
          canvasPosition,
          getLinksForCard,
          send,
          cardMachine,
        })
      );
      send({ type: "mediate", childType: "activate", id });
    },
    hydrateLink: ({ id, label, from, to }) => {
      addLink(createEdge({ id, label, from, to }));
    },
    createLink: ({ id, label, from, to }) => {
      addLink(createEdge({ id, label, from, to }));
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
    DRAG: ({ id }) => {
      const card = getCard(id);
      drag(card);
    },
  };

  return {
    runParentEffect: (action, data) => {
      const valid = isValid(parentEffects, action);
      if (valid) parentEffects[action](data);
    },
    runChildEffect: (action, data) => {
      const valid = isValid(childEffects, action);
      if (valid) childEffects[action](data);
    },
  };
}
