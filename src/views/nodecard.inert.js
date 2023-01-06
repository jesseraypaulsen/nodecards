export default function activeFaceFactory(domFace, graphFace) {
  return {
    activate({ view }) {
      domFace.expand({ view });
    },
  };
}
