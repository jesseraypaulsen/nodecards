import { generateId } from "../utils.js";
import drag from "../views/drag";

export default (container, send) =>
  (getLinksForCard, getCanvasPosition, getDomPosition) => {

    const editorController = (e, id) => {
      send({
        type: "mediate",
        childType: "TYPING",
        data: { text: e.target.value, id },
      });
    };

    const buttonsControllers = {
      unlock: (id) =>
        send({ type: "mediate", childType: "UNLOCK", data: { id } }),
      lock: (id) => send({ type: "mediate", childType: "LOCK", data: { id } }),
      delete: (id) => {
        const links = getLinksForCard(id);
        send({ type: "destroyCard", id, links });
      },
      inertify: (id) =>
        send({ type: "mediate", childType: "INERTIFY", data: { id } }),
      branch: (id) => {
        const linkId = generateId();
        const label = '';
        console.log('branching from card with id: ', id)
        send({ type: "BRANCH", linkId, label, from: id });
      },
      drag: (e, id) => {
        e.preventDefault();
        send("turnPhysicsOff");
        drag(container, { getDomPosition, getCanvasPosition, id, send });
      },
    };

    const linkTargetController = (id) => {
      send({
        type: "createLinkIfLinkCreationIsOn",
        to: id,
      });
    }

    /* idk if these next two functions are MVC controllers, but this file is the most convenient place to put them. */

    // highlight the card that the link originates from
    const startHighlightingSourceCard = (id) => {
      const fromCard = Array.from(container.querySelectorAll(".nodecard")).find(el => el.dataset.id == id)
      fromCard.classList.add('linking-from')
    }

    // remove the highlight from the card that originated the link
    const stopHighlightingSourceCard = (from) => {
      const fromCard = Array.from(container.querySelectorAll(".nodecard")).find(el => el.dataset.id == from)
      if (fromCard && fromCard.classList.contains('linking-from')) fromCard.classList.remove('linking-from')
    }

    return {
      editorController,
      buttonsControllers,
      linkTargetController,
    };
  };
