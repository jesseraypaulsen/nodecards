export function domControllers(send) {
  // for edit
  const editorController = (e, id) => {
    send({ type: "CARD.EDIT.TYPING", text: e.target.value, id });
  };

  // TODO: put switch panel controllers into separate file?

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

  const buttonsControllers = {
    edit: (id) => send({ type: "CARD.EDIT", id }),
    read: (id) => send({ type: "CARD.READ", id }),
    delete: (id) => send({ type: "CARD.DELETE", id }),
    inertify: (id) => send({ type: "CARD.INERTIFY", id }),
  };

  const promptController = {
    close: () => send({ type: "CLOSE.PROMPT" }),
    // "open" is triggered by the graph controller
  };

  return {
    editorController,
    panelControllers,
    buttonsControllers,
    promptController,
  };
}
