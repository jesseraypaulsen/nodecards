export default function activeFaceFactory(domFace, graphFace) {
  return {
    activate({ x, y, view }) {
      domFace.expand({ x, y, view });
    },
  };
}
