//activeFaceFactory
export default (domFace, graphFace) => {
  return {
    // creating a branch from this node to a different node
    createLink({ id, label, from, to }) {
      graphFace.createEdge(id, label, from, to);
    },
    discard(id) {
      graphFace.removeNode(id);
      domFace.removeElement();
      //should delete entire Nodecard instance
    },
    inertify(id) {
      domFace.collapse(id); // TODO: should delete domView instance
      //updateNode(id)
    },
    choose(view) {
      domFace.fillElement(view); // inject templates
    },
    updateEditor: domFace.updateEditor,
  };

  /*TODO
    const move = (id) => {
      moveNode(id);
      setPosition(qs("#" + id));
    };
  */
};
