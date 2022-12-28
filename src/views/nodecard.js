import activeFaceFactory from "./nodecard.active";
import inertFaceFactory from "./nodecard.inert";

/*
  Bridges together two different rendering environments, to produce a single indivisible UI entity called a Nodecard.
  @param {object} graphFace
  @param {object} domFace
  @returns {object}
*/
export default (graphFace, domFace) =>
  ({ id, label, text, position, setPosition }) => {
    let activeFace, inertFace;

    const { createNode, getNodePosition } = graphFace;
    // when getNodePosition is call from within this function, it returns the same coordinates no matter what node id you pass it,
    // but it works perfectly fine when called from App.js.

    createNode(id, label, position);

    activeFace = activeFaceFactory(domFace, graphFace);
    inertFace = inertFaceFactory(domFace, graphFace);

    return {
      id,
      //position,
      activeFace,
      inertFace,
    };
  };
