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
    },
    inertify() {
      domFace.collapse();
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
    move() {
      domFace.setElementPosition();
      graphFace.moveNode();
    },
    drag(getId, getDomPosition) {
      //pass this.move to dragger
    },
  };
};
