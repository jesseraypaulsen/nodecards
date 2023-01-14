import { isValid, generateId } from "../utils.js";

export default function DeckManager(cardFace, createEdge) {
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
    hydrateCard: ({ id, label, text, send }) => {
      addCard(cardFace({ id, label, text, send }));
    },
    createCard: ({ id, label, text, domPosition, canvasPosition, send }) => {
      addCard(
        cardFace({
          id,
          label,
          text,
          domPosition,
          canvasPosition,
          send,
        })
      );
      send({ type: "mediate", childType: "activate", id });
    },
    hydrateLink: ({ id, label, from, to }) => {
      addLink(createEdge({ id, label, from, to }));
    },
    createLink: ({ from, to }) => {
      console.log("createLink -> from: ", from);
      console.log("createLink -> to: ", to);
      const id = generateId();
      const label = "link";
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
  };

  return {
    runParentEffect: (action, data) => {
      console.log("runParentEffect -> ", action);
      const valid = isValid(parentEffects, action);
      if (valid) parentEffects[action](data);
    },
    runChildEffect: (action, data) => {
      const valid = isValid(childEffects, action);
      if (valid) childEffects[action](data);
    },
  };
}
