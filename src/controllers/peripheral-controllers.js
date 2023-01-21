import { generateId } from "../utils";

export default (send, calculatePositionThenCreate) => {
  const userEvent = (type) => ({ type, sentByUser: true });

  const panelControllers = {
    physics: (e) => {
      const chkValue = e.target.checked;
      chkValue
        ? send(userEvent("turnPhysicsOn"))
        : send(userEvent("turnPhysicsOff"));
    },

    appMode: (e) => {
      const chkValue = e.target.checked;
      chkValue ? send(userEvent("APP.ENABLE")) : send(userEvent("APP.DISABLE"));
    },
  };

  const promptController = {
    // "open" is triggered by the graph controller
    close: () => send({ type: "CLOSE.PROMPT" }),
    create: (domPosition) => {
      const id = generateId();
      const label = id;
      const text = "";

      calculatePositionThenCreate(id, label, text, domPosition);
    },
  };

  const linkPromptController = {
    // see graph controller for "open"
    // close: () => send({ type: "closeLinkPrompt" }),
    confirm: (id) => {
      send({ type: "destroyLink", id });
    },
  };

  return {
    panelControllers,
    promptController,
    linkPromptController,
  };
};
