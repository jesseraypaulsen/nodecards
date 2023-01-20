export default function inertFaceFactory(domFace, graphFace) {
  return {
    expandLocked() {
      domFace.openReader();
    },
    expandUnlocked() {
      domFace.openEditor();
    },
  };
}
