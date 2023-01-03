import activeFaceFactory from "./nodecard.active";
import inertFaceFactory from "./nodecard.inert";

/*
  Bridges together two different rendering environments, to produce a single indivisible UI entity called a Nodecard.
  @param {object} graphFace
  @param {object} domFace
  @returns {object}
*/
export default (graphFace, domFace) =>
  ({ id, label, text, domPosition, canvasPosition }) => {
    //TODO: change destructured values to one named object, called 'initalState.'
    //let {id, label, text, position} = initialState;
    //create getters/setters for these variables, and pass them down into domFace and graphFace,
    //and possibly activeFace and inertFace as well.
    const { createNode, createNodeWithKnownPosition } = graphFace;

    if (canvasPosition) createNodeWithKnownPosition(id, label, canvasPosition);
    else createNode(id, label);

    return {
      id,
      activeFace: activeFaceFactory(domFace, graphFace),
      inertFace: inertFaceFactory(domFace, graphFace),
    };
  };
