export default (send) => {
  const editorController = (e, id) => {
    send({ type: "TYPING", text: e.target.value, id });
  };
  const buttonsControllers = {
    edit: (id) => send({ type: "EDIT", id }),
    read: (id) => send({ type: "READ", id }),
    delete: (id) => send({ type: "DELETE", id }),
    inertify: (id) => send({ type: "INERTIFY", id }),
  };

  return {
    editorController,
    buttonsControllers,
  };
};
