export default function graphViews(network) {
  const createNode = (id, label) => {
    network.body.data.nodes.add({ id, label });
  };

  const createEdge = (id, label, from, to) => {
    network.body.data.edges.add({ id, label, from, to });
  };

  const removeNode = (id) => {
    network.body.data.nodes.remove(id);
  };

  const getNodeCenter = (id) => {
    let canvas = network.getPosition(id);
    let dom = network.canvasToDOM({ x: canvas.x, y: canvas.y });
    return { canX: canvas.x, canY: canvas.y, domX: dom.x, domY: dom.y };
  };

  const moveNode = (canX, canY) => {
    network.moveNode(this.id, canX, canY);
  };

  // TODO: find out if this is necessary or not
  const updateNode = (id) => {
    const options = {
      id,
      label: state.context.label,
      shape: "box",
      shadow: true,
      opacity: 1,
    };

    network.body.data.nodes.update(options);
  };

  const setPhysics = (value) => {
    const options = { physics: { enabled: value } };
    network.setOptions(options);
  };

  return {
    createNode,
    createEdge,
    removeNode,
    getNodeCenter,
    moveNode,
    updateNode,
    setPhysics,
  };
}
