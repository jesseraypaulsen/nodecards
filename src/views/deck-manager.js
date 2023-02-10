import { isValid } from "../utils.js";

export default function DeckManager(cardFace, createEdge, removeEdge) {
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

  const parentEffects = ({
    controllers,
    //setPositionAfterCreation,
    catchActiveCardEvent,
  }) => ({
    /*destroyCard: ({ id }) => {
      removeCard(id);
      This fails because it gets called no matter what state the parent machine is in.
    },*/
    hydrateCard: ({ id, label, text }) => {
      addCard(
        cardFace({
          id,
          label,
          text,
          getLinksForCard,
          controllers,
        })
      );
      //setPositionAfterCreation(id, 1000);
    },
    createCard: ({ id, label, text, domPosition, canvasPosition }) => {
      addCard(
        cardFace({
          id,
          label,
          text,
          domPosition,
          canvasPosition,
          getLinksForCard,
          controllers,
        })
      );
    },
    hydrateLink: ({ id, label, from, to }) => {
      addLink(createEdge({ id, label, from, to }));
    },
    createLink: ({ id, label, from, to }) => {
      addLink(createEdge({ id, label, from, to }));
    },
    catchActiveCardEvent: ({ id }) => {
      catchActiveCardEvent(id);
    },
    destroyLink: ({ id }) => {
      removeLink(id);
      removeEdge(id);
    },
  });

  const childEffects = {
    setDOMPosition: ({ id, domPosition }) => {
      getCard(id).setDomPosition(domPosition);
    },
    setCanvasPosition: ({ id, canvasPosition }) => {
      getCard(id).setCanvasPosition(canvasPosition);
    },
    activateUnlocked: ({ id }) => {
      getCard(id).inertFace.expandUnlocked();
    },
    activateLocked: ({ id }) => {
      getCard(id).inertFace.expandLocked();
    },
    INERTIFY: ({ id }) => {
      getCard(id).activeFace.inertify();
    },
    LOCK: ({ id }) => {
      getCard(id).activeFace.renderReader();
    },
    UNLOCK: ({ id }) => {
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
    MOVE: ({ id }) => {
      getCard(id).activeFace.move();
    },
  };

  return {
    setupParentEffect: (funcs) => (action, data) => {
      const _parentEffects = parentEffects(funcs);
      const valid = isValid(_parentEffects, action);
      if (valid) {
        _parentEffects[action](data);
      }
    },
    runChildEffect: (action, data) => {
      const valid = isValid(childEffects, action);
      if (valid) childEffects[action](data);
    },
  };
}
