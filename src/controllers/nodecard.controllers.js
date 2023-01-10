export default (send) => {
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
    delete: (id) => send({ type: "destroyCard", id }),
    inertify: (id) => send({ type: "mediate", childType: "INERTIFY", id }),
  };

  return {
    editorController,
    buttonsControllers,
  };
};
