export default function activeFaceFactory(domFace, graphFace) {
  return {
    activate({ id, x, y, nestedState, text, template, buttonBar }) {
      domFace.expand({ id, x, y, nestedState, text, template, buttonBar });
    },
  };
}
