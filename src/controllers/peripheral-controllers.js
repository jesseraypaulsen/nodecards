import { generateId } from "../utils";

export default (send, calculatePositionThenCreate) => {
  const userEvent = (type) => ({ type, sentByUser: true });

  const panelControllers = {
    //userEvent: (type) => ({ type, sentByUser: true }),

    physics: (e) => {
      const chkValue = e.target.checked;
      chkValue
        ? // ? send(panelControllers.userEvent("turnPhysicsOn"))
          //: send(panelControllers.userEvent("turnPhysicsOff"));
          send(userEvent("turnPhysicsOn"))
        : send(userEvent("turnPhysicsOff"));
    },

    persist: (e) => {
      const chkValue = e.target.checked;
      chkValue ? send("PERSIST.ON") : send("PERSIST.OFF");
    },

    select: (e) => {
      //send(panelControllers.userEvent(e.target.value));
      send(userEvent(e.target.value));
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

  return {
    panelControllers,
    promptController,
  };
};