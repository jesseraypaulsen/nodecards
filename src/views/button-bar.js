import { div, span } from "./dom-helpers";
import dragIcon from "../../assets/icons/drag_indicator.png";
import deleteIcon from "../../assets/icons/delete_forever.png";
import editIcon from "../../assets/icons/edit.png";
import editOffIcon from "../../assets/icons/edit_off.png";
import linkIcon from "../../assets/icons/link.png";
import inertifyIcon from "../../assets/icons/swipe_down_alt.png";

//createButtonBar
export default (controllers) => (id, source) => {
  // pass id into controller
  const wrapController = (e, controller) => {
    //const parent = e.target.parentElement.parentElement.parentElement;
    //controller(parent.id);
    controller(id);
  };

  const eventType = "click";
  const classNames = ["button"];

  const buttonData = {
    drag: {
      icon: dragIcon,
      handler: (e) => drag(e),
      eventType: "mousedown",
      classNames: [...classNames, "drag"],
      active: true,
    },
    edit: {
      icon: editIcon,
      handler: (e) => wrapController(e, controllers.edit),
      eventType,
      classNames,
      active: true,
    },
    read: {
      icon: editOffIcon,
      handler: (e) => wrapController(e, controllers.read),
      eventType,
      classNames,
      active: true,
    },
    discard: {
      icon: deleteIcon,
      handler: (e) => wrapController(e, controllers.delete),
      eventType,
      classNames,
      active: true,
    },
    source: {
      icon: linkIcon,
      handler: (e) => (source ? open(source, "_blank") : null),
      eventType,
      classNames,
      active: source ? true : false,
    },
    inertify: {
      icon: inertifyIcon,
      handler: (e) => wrapController(e, controllers.inertify),
      eventType,
      classNames,
      active: true,
    },
  };

  /*
  let buttons;
  if (state == "read")
    buttons = [0, 1, 3, 4, 5].map((i) => createButton(buttonData[i]));
  else if (state == "edit")
    buttons = [0, 2, 3, 4, 5].map((i) => createButton(buttonData[i]));
    
    buttonBar.append(...buttons);
    */

  let buttons = {};
  for (let key in buttonData) {
    buttons[key] = createButton(buttonData[key]);
  }
  return diverge(buttons);
};

function diverge({ drag, edit, read, discard, source, inertify }) {
  return {
    readerBar: () => createBar([drag, edit, discard, source, inertify]),
    editorBar: () => createBar([drag, read, discard, source, inertify]),
  };
}

function createBar(buttons) {
  const bar = div("button-bar");
  bar.append(...buttons);
  return bar;
}

function createButton({ icon, handler, eventType, classNames, active }) {
  const button = span(...classNames);

  let img = document.createElement("img");
  img.src = icon;
  button.appendChild(img);

  // business logic; depends on whether the app is in the modify state.
  // should depend on a template chosen by XState.
  if (!active) button.classList.add("inactive");

  button.addEventListener(eventType, handler);

  return button;
}

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
