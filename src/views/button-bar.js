import { qs, render, setPosition } from './nodecard.dom'
import dragIcon from "../../assets/icons/drag_indicator.png";
import deleteIcon from "../../assets/icons/delete_forever.png";
import editIcon from "../../assets/icons/edit.png";
import editOffIcon from "../../assets/icons/edit_off.png";
import linkIcon from "../../assets/icons/link.png";
import inertifyIcon from "../../assets/icons/swipe_down_alt.png";

function createButtonBar(state, source, controllers) {
    
  const wrapController = (e, controller) => {
    const parent = e.target.parentElement.parentElement.parentElement;
    console.log(parent.id)
    controller(parent.id)
  }

  const buttonData = [
    {
        name: "Drag",
        icon: dragIcon,
        handler: (e) => drag(e),
        active: true
    },
    {
        name: "Edit",
        icon: editIcon,
        handler: (e) => wrapController(e, controllers.buttons.edit),
        active: true
    },
    {
        name: "Read Only",
        icon: editOffIcon,
        handler: (e) => wrapController(e, controllers.buttons.read),
        active: true
    },
    {
        name: "Delete",
        icon: deleteIcon,
        handler: (e) => wrapController(e, controllers.buttons.delete),
        active: true
    },
    {
        name: "Source",
        icon: linkIcon,
        handler: (e) => source ? open(source, "_blank") : null,
        active: source ? true : false
      },
      {
        name: "Inertify",
        icon: inertifyIcon,
        handler: (e) => wrapController(e, controllers.buttons.inertify),
        active: true
      }
    ]
    

  const buttonBar = document.createElement("div");
  buttonBar.classList.add("button-bar");

  let buttons;

  if (state == "read") buttons = [0, 1, 3, 4, 5].map((i) => createButton(buttonData[i]));
  else if (state == "edit") buttons = [0, 2, 3, 4, 5].map((i) => createButton(buttonData[i]));

  buttonBar.append(...buttons);

  return buttonBar;
  
}

function createButton(obj) {

  const button = document.createElement("span");
  button.classList.add("button");

  let img = document.createElement('img');
  img.src = obj.icon;
  button.appendChild(img);

  if (!obj.active) button.classList.add("inactive")

  let eventType = "click";

  if (obj.name == "Drag") {
      eventType = "mousedown";
      button.style.cursor = "grab";
  }

  //const eventType = obj.name == "Drag" ? "mousedown" : "click";

  button.addEventListener(eventType, obj.handler);

  return button;
}

function drag(e, card) {
  e.preventDefault(); // required in order to fire/catch the mouseup event. Why? No idea.
  turnPhysicsOff(); // physics must be turned off for dragging to work.
  let move = true;

  const container = card.app.container;
  container.addEventListener("mouseup", (e) => {
      move = false;
  }, { once: true }); // the last arg removes event listener after it runs once
  
  container.addEventListener("mousemove", moveHandler)
  function moveHandler(e) {
    let dx = e.movementX*1.6;  //the 1.6 factor is a crude hack that compensates for a delay between mouse and element position.
    let dy = e.movementY*1.6;  //the movementX/movementY properties on the event object return the difference between successive mouse positions.
    if (move) {
      const pos = card.getNodeCenter()

      card.app.graphRenderer.moveNode(card.id, pos.canX + dx, pos.canY + dy);
      card.setPosition(pos.domX + dx, pos.domY + dy);
      // using Nodecard.prototype.move() causes internal error in vis-network/BarnesHutSolver.js,"too much recursion"
    } else {
        container.removeEventListener("mousemove", moveHandler)
    }
  }
}



export default createButtonBar;