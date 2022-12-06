export default function activeFaceFactory(domFace, graphFace) {
  return {
    activate({ id, x, y, nestedState, text }) {
      domFace.expand({ id, x, y, nestedState, text });
    },
  };
}
