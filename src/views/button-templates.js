import dragIcon from "../../assets/icons/drag_indicator.png";
import deleteIcon from "../../assets/icons/delete_forever.png";
import editIcon from "../../assets/icons/edit.png";
import editOffIcon from "../../assets/icons/edit_off.png";
import linkIcon from "../../assets/icons/link.png";
import inertifyIcon from "../../assets/icons/swipe_down_alt.png";

const eventType = "click";
const classNames = ["button"];
export const buttonTemplates = [
  {
    name: "Drag",
    icon: dragIcon,
    handler: (e) => drag(e),
    eventType: "mousedown",
    classNames: [...classNames, "drag"],
    active: true,
  },
  {
    name: "Edit",
    icon: editIcon,
    handler: (e) => wrapController(e, controllers.buttons.edit),
    eventType,
    classNames,
    active: true,
  },
  {
    name: "Read Only",
    icon: editOffIcon,
    handler: (e) => wrapController(e, controllers.buttons.read),
    eventType,
    classNames,
    active: true,
  },
  {
    name: "Delete",
    icon: deleteIcon,
    handler: (e) => wrapController(e, controllers.buttons.delete),
    eventType,
    classNames,
    active: true,
  },
  {
    name: "Source",
    icon: linkIcon,
    handler: (e) => (source ? open(source, "_blank") : null),
    eventType,
    classNames,
    active: source ? true : false,
  },
  {
    name: "Inertify",
    icon: inertifyIcon,
    handler: (e) => wrapController(e, controllers.buttons.inertify),
    eventType,
    classNames,
    active: true,
  },
];

function drag(e, card) {
  e.preventDefault(); // required in order to fire/catch the mouseup event. Why? No idea.
  turnPhysicsOff(); // physics must be turned off for dragging to work.
  let move = true;

  const container = card.app.container;
  container.addEventListener(
    "mouseup",
    (e) => {
      move = false;
    },
    { once: true }
  ); // the last arg removes event listener after it runs once

  container.addEventListener("mousemove", moveHandler);
  function moveHandler(e) {
    let dx = e.movementX * 1.6; //the 1.6 factor is a crude hack that compensates for a delay between mouse and element position.
    let dy = e.movementY * 1.6; //the movementX/movementY properties on the event object return the difference between successive mouse positions.
    if (move) {
      const pos = card.getNodeCenter();

      card.app.graphRenderer.moveNode(card.id, pos.canX + dx, pos.canY + dy);
      card.setPosition(pos.domX + dx, pos.domY + dy);
      // using Nodecard.prototype.move() causes internal error in vis-network/BarnesHutSolver.js,"too much recursion"
    } else {
      container.removeEventListener("mousemove", moveHandler);
    }
  }
}
