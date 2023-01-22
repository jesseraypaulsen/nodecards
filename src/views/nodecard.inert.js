export default function inertFaceFactory(domFace, graphFace) {
  return {
    expandLocked() {
      domFace.openContainer();
      domFace.renderReader();
    },
    expandUnlocked() {
      domFace.openContainer();
      domFace.renderEditor();
    },
  };
}
