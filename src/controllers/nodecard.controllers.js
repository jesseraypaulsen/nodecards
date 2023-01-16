import { generateId } from "../utils.js";

export default (send, sendToCardMachine, getLinksForCard) => {
  const editorController = (e, id) => {
    send({
      type: "mediateToModify",
      childType: "TYPING",
      data: { text: e.target.value, id },
    });
  };
  const buttonsControllers = {
    edit: (id) =>
      send({ type: "mediateToModify", childType: "EDIT", data: { id } }),
    read: (id) => send({ type: "mediate", childType: "READ", id }),
    delete: (id) => {
      const links = getLinksForCard(id);
      send({ type: "destroyCard", id, links });
    },
    inertify: (id) => send({ type: "mediate", childType: "INERTIFY", id }),
    branch: (id) => {
      const linkId = generateId();
      const label = linkId;
      send({ type: "BRANCH", linkId, label, from: id });
    },
    drag: (e) => {
      console.log("drag!!");
      e.preventDefault();
      send("turnPhysicsOff");
      sendToCardMachine("DRAG");
    },
  };

  return {
    editorController,
    buttonsControllers,
  };
};
