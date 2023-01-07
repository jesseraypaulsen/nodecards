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
    const getId = () => id;
    const getLabel = () => label;
    const getText = () => text;
    const getCanvasPosition = () => canvasPosition;
    const getDomPosition = () => domPosition;

    const setText = (nextText) => {
      text = nextText;
    };
    const setDomPosition = (nextDomPosition) => {
      domPosition = nextDomPosition;
    };
    const graphFace = graphFaceFactory(getId, getLabel, getCanvasPosition);
    const domFace = domFaceFactory(getDomPosition, getText, getId);
    const { createNode, createNodeWithKnownPosition } = graphFace;
    if (canvasPosition) createNodeWithKnownPosition();
    else createNode();

    return {
      id,
      setDomPosition,
      setText,
      activeFace: activeFaceFactory(domFace, graphFace),
      inertFace: inertFaceFactory(domFace, graphFace),
    };
  };
