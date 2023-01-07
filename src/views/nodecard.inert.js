export default function inertFaceFactory(domFace, graphFace) {
  return {
    activate() {
      domFace.expand();
    },
  };
}
