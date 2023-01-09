export default (send) => {
  const panelControllers = {
    userEvent: (type) => ({ type, sentByUser: true }),

    physics: (e) => {
      const chkValue = e.target.checked;
      chkValue
        ? send(panelControllers.userEvent("turnPhysicsOn"))
        : send(panelControllers.userEvent("turnPhysicsOff"));
    },

    persist: (e) => {
      const chkValue = e.target.checked;
      chkValue ? send("PERSIST.ON") : send("PERSIST.OFF");
    },

    select: (e) => {
      send(panelControllers.userEvent(e.target.value));
    },
  };

  const promptController = {
    // "open" is triggered by the graph controller
    close: () => send({ type: "CLOSE.PROMPT" }),
    create: (domPosition) =>
      send({
        type: "convertDataBeforeCreation",
        domPosition,
      }),
  };

  return {
    panelControllers,
    promptController,
  };
};
