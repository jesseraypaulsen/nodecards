export default function graphAdapterFactoryFactory(network) {
  return (getId, getLabel, getCanvasPosition) => {
    const createNode = () => {
      network.body.data.nodes.add({ id: getId(), label: getLabel() });
    };

    const createNodeWithKnownPosition = () => {
      const { x, y } = getCanvasPosition();
      network.body.data.nodes.add({ id: getId(), label: getLabel(), x, y });
    };

    const removeNode = () => {
      network.body.data.nodes.remove(getId());
    };

    const moveNode = () => {
      const { x, y } = getCanvasPosition();
      network.moveNode(getId(), x, y);
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
      removeNode,
      moveNode,
      updateNode,
    };
  };
}
