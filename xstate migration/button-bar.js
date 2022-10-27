import dragIcon from "../icons/drag_indicator.png";
import deleteIcon from "../icons/delete_forever.png";
import editIcon from "../icons/edit.png";
import editOffIcon from "../icons/edit_off.png";
import linkIcon from "../icons/link.png";
import inertifyIcon from "../icons/swipe_down_alt.png";
//import { turnPhysicsOff } from "./switch-panel";


function attachButtonBar(card) {
    
  const buttonData = [
    {
        name: "Drag",
        icon: dragIcon,
        handler: (e) => drag(e, card),
        active: true
    },
    {
        name: "Edit",
        icon: editIcon,
        handler: () => card.deck.send({ type: "CARD.EDIT", id: card.id }),
        active: true
    },
    {
        name: "Read Only",
        icon: editOffIcon,
        handler: () => card.deck.send({ type: "CARD.READ", id: card.id }),
        active: true
    },
    {
        name: "Delete",
        icon: deleteIcon,
        handler: () => card.deck.send({ type: "CARD.DISCARD", id: card.id }),
        active: true
    },
    {
        name: "Source",
        icon: linkIcon,
        handler: (e) => source(card),
        active: card.webSource ? true : false
    },
    {
        name: "Inertify",
        icon: inertifyIcon,
        handler: () => card.deck.send({ type: "CARD.INERTIFY", id: card.id }),
        active: true
    }
  ]
  
  const buttonBar = document.createElement("div");
  buttonBar.classList.add("button-bar");

  let buttons;
  //if (card.mode == "read") 
  buttons = [0, 1, 3, 4, 5].map((i) => createButton(buttonData[i]));
  //else if (card.mode == "write") buttons = [0, 2, 3, 4, 5].map((i) => createButton(buttonData[i]));
  buttonBar.append(...buttons);
  
  // if (card.domElement.lastElementChild.classList.contains("button-bar")) {
  //     card.domElement.lastElementChild.remove();
  // }
  card.domElement.append(buttonBar);
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

  const container = card.deck.container;
  container.addEventListener("mouseup", (e) => {
      move = false;
  }, { once: true }); // the last arg removes event listener after it runs once
  
  container.addEventListener("mousemove", moveHandler)
  function moveHandler(e) {
    let dx = e.movementX*1.6;  //the 1.6 factor is a crude hack that compensates for a delay between mouse and element position.
    let dy = e.movementY*1.6;  //the movementX/movementY properties on the event object return the difference between successive mouse positions.
    if (move) {
      const pos = card.getNodeCenter()

      card.deck.graphRenderer.moveNode(card.id, pos.canX + dx, pos.canY + dy);
      card.setPosition(pos.domX + dx, pos.domY + dy);
      // using Nodecard.prototype.move() causes internal error in vis-network/BarnesHutSolver.js,"too much recursion"
    } else {
        container.removeEventListener("mousemove", moveHandler)
    }
  }
}

function source(card) {
    if (card.webSource) open(card.webSource, "_blank");
}


export default attachButtonBar;