import graphViews from "./graph";
import domViews from "./nodecard.dom";

export default function nodecardViews(graphAPI, domControllers) {
  /* const {
    collapse,
    expand,
    removeElement,
    setPosition,
    fillElement,
    updateEditor,
  } = domViews(domControllers); */

  let domFace, graphFace, cardFace;
  domFace = domViews(domControllers);

  //TODO: lift next line
  let gV = graphViews(graphAPI);
  const { createNode } = gV;
  graphFace = { createEdge, moveNode, removeNode } = gV;

  //cardFace = cardFaceFactory(domFace, graphFace);
  //where cardFace is identical to the returned object below.
  //cardFace receives domFace and graphFace, and it returns active/inert capability.

  //return { face: cardFace, setFaceMethod }
  /* 
  //initialize
  const bud = graphFace.createNode(id, label);
  let bloom = { expandCard };

  create a special method for setting the bloom view. then inject inert/active view from app.js.
  */

  return {
    expandCard({ id, x, y, nestedState, text }) {
      domFace.expand({ id, x, y, nestedState, text });

      /*TODO: setup new domView instance
      domFace = createDOMView(id, label, text); // starts with only expand()
      */

      //what is the proper place for this method? given that many of the above methods are only meaningful as a result of this method call.
    },
    createCard(id, label) {
      //TODO: create Nodecard instance.
      // currently we're just creating a node for the graph renderer.
      // where does this function go, given that it can't exist on the Nodecard instance?
      createNode(id, label);
    },
    // creating a branch from this node to a different node
    createLink({ id, label, from, to }) {
      //TODO: either call createCard() or use a currently existing card depending on where the user clicks.
      //most likely send event to XState through a controller, instead of calling createCard() directly.
      graphFace.createEdge(id, label, from, to);
    },
    discard(id) {
      graphFace.removeNode(id);
      domFace.removeElement("#" + id);
      //should delete entire Nodecard instance
    },
    inertify(id) {
      domFace.collapse(id); // TODO: should delete domView instance
      //updateNode(id)
    },
    fillElement: domFace.fillElement,
    updateEditor: domFace.updateEditor,
  };

  /*TODO
  const move = (id) => {
    moveNode(id);
    setPosition(qs("#" + id));
  };
*/
}
