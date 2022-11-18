/*

import { options } from "./options";
import * as vis from "vis-network";
import { typeofSelection } from "./utils";

// TODO: decouple from DOM API
const container = document.querySelector("#container");
const network = new vis.Network(container, {}, options);

// TODO: create graph controller to mediate events

const handler = (e) => {
  const eventType = typeofSelection(e)
  if (eventType === "NC") service.send({ type: "CARD.CLICK", id: e.nodes[0] })
  if (eventType === "BG") service.send({ type: "CLICK.BACKGROUND", data: e })
}

network.on("click", handler)

*/

// for app.js > createCard
const createNode = (id,label) => {
  network.body.data.nodes.add({ id, label });
}

// for app.js > createLink
const createEdge = ({id,label,from,to}) => {
  network.body.data.edges.add({ id, label, from, to });
}



// for discard method
const removeNode = (id) => {
  network.body.data.nodes.remove(id);
}


const getNodeCenter = (id) => {
  let canvas = network.getPosition(id);
  let dom = network.canvasToDOM({ x: canvas.x, y: canvas.y });
  return { canX: canvas.x, canY: canvas.y, domX: dom.x, domY: dom.y };
}

// for move
const moveNode = ({ canX, canY }) => {
  network.moveNode(this.id, canX, canY);
}

// TODO: find out if this is necessary or not
const updateNode = (id) => {

  const options = {
    id,
    label: state.context.label,
    shape: "box",
    shadow: true,
    opacity: 1,
    //font: this.canvasFont
  }

  network.body.data.nodes.update(options);

}

const setPhysics = (value) => {
  const options = { physics: { enabled: value } };
  network.setOptions(options);
}


