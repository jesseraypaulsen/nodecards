import activeFaceFactory from "./nodecard.active";
import inertFaceFactory from "./nodecard.inert";

/*
  Bridges together two different rendering environments, to produce a single indivisible UI entity called a Nodecard.
  @param {object} graphFace
  @param {object} domFace
  @returns {object}
*/
export default (graphFaceFactory, domFaceFactory) =>
  ({ id, label, text, domPosition, canvasPosition }) => {
    //TODO: if (!id) id = generateId();
    const getId = () => id;
    const graphFace = graphFaceFactory(getId);
    const domFace = domFaceFactory();
    const { createNode, createNodeWithKnownPosition } = graphFace;

    if (canvasPosition) createNodeWithKnownPosition(id, label, canvasPosition);
    else createNode(id, label);

    return {
      id,
      activeFace: activeFaceFactory(domFace, graphFace),
      inertFace: inertFaceFactory(domFace, graphFace),
    };
  };
