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
    const getLabel = () => label;
    const getCanvasPosition = () => canvasPosition;
    const getDomPosition = () => domPosition;
    const setDomPosition = (nextDomPosition) => {
      domPosition = nextDomPosition;
    };
    const graphFace = graphFaceFactory(getId, getLabel, getCanvasPosition);
    const domFace = domFaceFactory(getDomPosition);
    const { createNode, createNodeWithKnownPosition } = graphFace;
    if (canvasPosition) createNodeWithKnownPosition();
    else createNode();

    return {
      id,
      setDomPosition,
      activeFace: activeFaceFactory(domFace, graphFace),
      inertFace: inertFaceFactory(domFace, graphFace),
    };
  };
