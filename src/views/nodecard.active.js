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
    renderReader() {
      domFace.renderReader();
    },
    renderEditor() {
      domFace.renderEditor();
    },
    updateEditor() {
      domFace.updateEditor();
    },
  };

  /*TODO
    const move = (id) => {
      moveNode(id);
      setPosition(qs("#" + id));
    };
  */
};
