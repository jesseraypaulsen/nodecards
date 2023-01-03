export default function graphFaceFactory(network) {
  const createNode = (id, label) => {
    network.body.data.nodes.add({ id, label });
  };

  const createNodeWithKnownPosition = (id, label, { x, y }) => {
    network.body.data.nodes.add({ id, label, x, y });
  };

  const createEdge = (id, label, from, to) => {
    network.body.data.edges.add({ id, label, from, to });
  };

  const removeNode = (id) => {
    network.body.data.nodes.remove(id);
  };

  const getNodePosition = (id) => {
    let canvas = network.getPosition(id);
    let dom = network.canvasToDOM({ x: canvas.x, y: canvas.y });
    return { canvasX: canvas.x, canvasY: canvas.y, domX: dom.x, domY: dom.y };
  };

  const moveNode = (canvasX, canvasY) => {
    network.moveNode(id, canvasX, canvasY);
  };

  // TODO: find out if this is necessary or not
  const updateNode = (id) => {
    const label = "";
    const options = {
      id,
      label,
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
    createNodeWithKnownPosition,
    createEdge,
    removeNode,
    getNodePosition,
    moveNode,
    updateNode,
    setPhysics,
  };
}
