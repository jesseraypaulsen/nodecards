//activeFaceFactory
export default (domFace, graphFace) => {
  return {
    // creating a branch from this node to a different node
    createLink({ id, label, from, to }) {
      graphFace.createEdge(id, label, from, to);
    },
    discard() {
      graphFace.removeNode();
      domFace.removeElement();
      //TODO: should delete entire Nodecard instance
    },
    inertify() {
      domFace.collapse(); // TODO: should delete domView instance
      //updateNode(id)
    },
    choose(view) {
      domFace.fillElement(view);
    },
    updateEditor({ text }) {
      domFace.updateEditor(text);
    },
  };

  /*TODO
    const move = (id) => {
      moveNode(id);
      setPosition(qs("#" + id));
    };
  */
};
