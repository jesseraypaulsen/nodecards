export default (send) => {
  const editorController = (e, id) => {
    send({ type: "CARD.EDIT.TYPING", text: e.target.value, id });
  };
  const buttonsControllers = {
    edit: (id) => send({ type: "CARD.EDIT", id }),
    read: (id) => send({ type: "CARD.READ", id }),
    delete: (id) => send({ type: "CARD.DELETE", id }),
    inertify: (id) => send({ type: "CARD.INERTIFY", id }),
  };

  return {
    editorController,
    buttonsControllers,
  };
};
