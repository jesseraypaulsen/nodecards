export default (send) => {
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

  const linkPromptController = {
    // see graph controller for "open"
    // close: () => send({ type: "closeLinkPrompt" }),
    confirm: (id) => {
      send({ type: "destroyLink", id });
    },
  };

  return {
    panelControllers,
    linkPromptController,
  };
};
