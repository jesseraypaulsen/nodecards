import { MDCTooltip } from "@material/tooltip";
import { MDCRipple } from "@material/ripple";
import { turnTogglerSwitchOff } from "./switch-panel";

const items = [
  { id: "tooltip-drag", msg: "Drag", icon: "drag_indicator" },
  { id: "tooltip-edit", msg: "Edit", icon: "edit" },
  { id: "tooltip-readonly", msg: "Read only", icon: "edit_off" },
  { id: "tooltip-delete", msg: "Delete", icon: "delete" },
  { id: "tooltip-link", msg: "Source", icon: "link" },
  { id: "tooltip-inertify", msg: "Inertify", icon: "swipe_down_alt" },
];

function attachButtonBar(container, card) {
  const buttonBar = document.createElement("div");
  buttonBar.classList.add("button-bar");
  container.append(buttonBar);

  if (card.mode == "read") {
    [0, 1, 3, 4, 5].map((i) => {
      const obj = createButtonWithTooltip(items[i], card);
      buttonBar.append(obj.el);
      setupMaterialDesign(obj);
    });
  } else if (card.mode == "write") {
    [0, 2, 3, 4, 5].map((i) => {
      const obj = createButtonWithTooltip(items[i], card);
      buttonBar.append(obj.el);
      setupMaterialDesign(obj);
    });
  }
}

function createButtonWithTooltip(item, card) {
  const tooltip = document.createElement("div");
  tooltip.id = item.id;
  tooltip.setAttribute("role", "tooltip");
  tooltip.setAttribute("aria-hidden", "true");
  tooltip.classList.add("mdc-tooltip");
  const message = document.createElement("div");
  message.classList.add(
    "mdc-tooltip__surface",
    "mdc-tooltip__surface-animation"
  );
  message.textContent = item.msg;
  tooltip.append(message);

  /* Material Tooltip
  <div
    id="${item.id}"
    class="mdc-tooltip"
    role="tooltip"
    aria-hidden="true"
    >
    <div class="mdc-tooltip__surface mdc-tooltip__surface-animation">
    ${item.msg}
  </div>
  </div>
  */

  const iconButton = document.createElement("button");
  iconButton.classList.add("mdc-icon-button", "material-icons");

  iconButton.setAttribute("aria-describedby", item.id);
  //iconButton.dataset.tooltipId = item.id;
  //setting the data-tooltip-id attribute is an alternative to setting the aria-describedby attribute.
  //this is how the tooltip gets attached to the button.

  const ripple = document.createElement("div");
  ripple.classList.add("mdc-icon-button__ripple");
  const focusRing = document.createElement("span");
  focusRing.classList.add("mdc-icon-button__focus-ring");
  iconButton.append(ripple, focusRing, item.icon);

  if (item.id == "tooltip-inertify") {
    iconButton.addEventListener("click", (e) => {
      // this == e.target
      console.log(`inertify button clicked`);

      if (card.mode == "read") {
        card.setMode("inert");
      }
      if (card.mode == "write" && card.state == "floating") {
        card.deck.discard(card.id);
      } else if (card.mode == "write") {
        card.setMode("inert");
      }
      card.deck.currCard = { state: "empty" };
    });
  }

  if (item.id == "tooltip-edit") {
    iconButton.addEventListener("click", (e) => {
      card.setMode("write");
    });
  }

  if (item.id == "tooltip-readonly") {
    iconButton.addEventListener("click", (e) => {
      card.setMode("read");
    });
  }

  if (item.id == "tooltip-drag") {

    iconButton.addEventListener("mousedown", (e) => {
      e.preventDefault(); // required in order to fire/catch the mouseup event. Why? No idea.
      turnTogglerSwitchOff(); // physics must be turned off for dragging to work.
      let move = true;
      let prevX = e.x;
      let prevY = e.y;
      
      const container = card.deck.container;
      container.addEventListener("mouseup", (e) => {
        move = false;
      }, { once: true }); // the last arg removes event listener after it runs once
      
      container.addEventListener("mousemove", moveHandler)
      function moveHandler(e) {
        if (move) {
          let deltaX = e.x - prevX;
          let deltaY = e.y - prevY;
          const pos = card.deck.getNodeCenter(card.id)

          card.deck.net.moveNode(card.id, pos.canX + deltaX, pos.canY + deltaY);
          card.setPosition(pos.domX + deltaX, pos.domY + deltaY);
          // using Nodecard.prototype.move() causes internal error in vis-network/BarnesHutSolver.js,"too much recursion"
          prevX = e.x;
          prevY = e.y;
        } else {
          container.removeEventListener("mousemove", moveHandler)
        }
      }

      //https://stackoverflow.com/q/4936324 -> self-destructing event listener

    })
  }

  if (item.id == "tooltip-delete") {
    iconButton.addEventListener("click", (e) => {
      console.log("delete button clicked");
    });
  }

  if (item.id == "tooltip-link") {
    if (card.webSource) {
      iconButton.addEventListener("click", (e) => {
        console.log("source button clicked");
        open(card.webSource, "_blank");
      });
    } else {
      iconButton.classList.add("md-inactive")
    }
  } 

  /* Material Icon-Button
  <button
  class="mdc-icon-button material-icons"
  aria-describedby="${item.id}"
    >
    <div class="mdc-icon-button__ripple"></div>
    <span class="mdc-icon-button__focus-ring"></span>
    ${item.icon}
    </button>
    */

  const el = document.createElement("div");
  el.style.display = "inline-block";
  el.append(iconButton, tooltip);

  return { el, iconButton, tooltip };
}

function setupMaterialDesign({ iconButton, tooltip }) {
  new MDCTooltip(tooltip);
  const iconButtonRipple = new MDCRipple(iconButton);
  iconButtonRipple.unbounded = true;
}

export default attachButtonBar;
