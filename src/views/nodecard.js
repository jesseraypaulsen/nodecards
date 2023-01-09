import activeFaceFactory from "./nodecard.active";
import inertFaceFactory from "./nodecard.inert";

/*
  Bridges together two different rendering environments, to produce a single indivisible UI entity called a Nodecard.
  @param {object} graphAdapter
  @param {object} domAdapter
  @returns {object}
*/
export default (graphAdapterFactory, domAdapterFactory) =>
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
    const graphAdapter = graphAdapterFactory(
      getId,
      getLabel,
      getCanvasPosition
    );
    const domAdapter = domAdapterFactory(getDomPosition, getText, getId);
    const { createNode, createNodeWithKnownPosition } = graphAdapter;
    if (canvasPosition) createNodeWithKnownPosition();
    else createNode();

    return {
      getId,
      setDomPosition,
      setText,
      activeFace: activeFaceFactory(domAdapter, graphAdapter),
      inertFace: inertFaceFactory(domAdapter, graphAdapter),
    };
  };
