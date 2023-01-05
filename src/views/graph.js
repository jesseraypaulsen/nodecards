export default function graphFaceFactoryFactory(network) {
  return (getId) => {
    const createNode = (id, label) => {
      network.body.data.nodes.add({ id, label });
    };

    const createNodeWithKnownPosition = (id, label, { x, y }) => {
      network.body.data.nodes.add({ id, label, x, y });
    };
    /*
    const createEdge = (id, label, from, to) => {
      network.body.data.edges.add({ id, label, from, to });
    };
    const setPhysics = (value) => {
      const options = { physics: { enabled: value } };
      network.setOptions(options);
    };
    */

    const removeNode = () => {
      network.body.data.nodes.remove(getId());
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

    return {
      createNode,
      createNodeWithKnownPosition,
      //createEdge,
      removeNode,
      moveNode,
      updateNode,
      //setPhysics,
    };
  };
}
