import activeFaceFactory from "./nodecard.active";
import inertFaceFactory from "./nodecard.inert";

/*
  Bridges together two different rendering environments, to produce a single indivisible UI entity called a Nodecard.
  @param {object} graphAdapter
  @param {object} domAdapter
  @returns {object}
*/
export default (graphAdapterFactory, domAdapterFactory) =>
  ({
    id,
    label,
    text,
    domPosition,
    canvasPosition,
    getLinksForCard,
    controllers,
  }) => {
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
    const setCanvasPosition = (nextCanvasPosition) => {
      canvasPosition = nextCanvasPosition;
    };
    console.log(controllers)
    const { editorController, buttonsControllers, linkTargetController } = controllers(
      getLinksForCard,
      getCanvasPosition,
      getDomPosition
    );

    const graphAdapter = graphAdapterFactory(
      getId,
      getLabel,
      getCanvasPosition
    );
    const domAdapter = domAdapterFactory(
      getDomPosition,
      getText,
      getId,
      editorController,
      buttonsControllers,
      linkTargetController
    );

    const { createNode, createNodeWithKnownPosition } = graphAdapter;
    if (canvasPosition) createNodeWithKnownPosition();
    else createNode();

    return {
      getId,
      setDomPosition,
      setCanvasPosition,
      getDomPosition,
      getCanvasPosition,
      setText,
      activeFace: activeFaceFactory(domAdapter, graphAdapter),
      inertFace: inertFaceFactory(domAdapter, graphAdapter),
    };
  };
