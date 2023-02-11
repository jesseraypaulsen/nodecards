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
        const label = linkId;
        send({ type: "BRANCH", linkId, label, from: id });
      },
      drag: (e, id) => {
        e.preventDefault();
        send("turnPhysicsOff");
        drag(container, { getDomPosition, getCanvasPosition, id, send });
      },
    };

    return {
      editorController,
      buttonsControllers,
    };
  };
