import activeFaceFactory from "./nodecard.face.active"; //TODO: inject
import inertFaceFactory from "./nodecard.face.inert";

/*
  Bridges together two different rendering environments, to produce a single indivisible UI entity called a Nodecard.
  @param {object} graphFace
  @param {object} domFace
  @returns {object}
*/
export default (graphFace, domFace) =>
  ({ id, label, text }) => {
    let activeFace, inertFace, nodeId;

    const { createNode } = graphFace;
    createNode(id, label);

    activeFace = activeFaceFactory(domFace, graphFace);
    inertFace = inertFaceFactory(domFace, graphFace);

    return {
      id,
      activeFace,
      inertFace,
      //setFace(newFace) {
      //cardFace = newFace;
      //}
    };
  };
