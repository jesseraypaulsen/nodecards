import { MDCTooltip } from "@material/tooltip";
import { MDCRipple } from "@material/ripple";

const items = [
  { id: "tooltip-drag", msg: "Drag", icon: "drag_indicator" },
  { id: "tooltip-edit", msg: "Edit", icon: "edit" },
  { id: "tooltip-readonly", msg: "Read only", icon: "edit_off" },
  { id: "tooltip-delete", msg: "Delete", icon: "delete" },
  { id: "tooltip-inertify", msg: "Inertify", icon: "swipe_down_alt" },
];

function attachButtonBar(container, card) {
  const buttonBar = document.createElement("div");
  buttonBar.classList.add("button-bar");

  const line = document.createElement("hr");
  container.append(line, buttonBar);

  if (card.mode == "read") {
    [0, 1, 3, 4].map((i) => {
      const obj = createButtonWithTooltip(items[i]);
      buttonBar.append(obj.el);
      setupMaterialDesign(obj);
    });
  } else if (card.mode == "write") {
    [0, 2, 3, 4].map((i) => {
      const obj = createButtonWithTooltip(items[i]);
      buttonBar.append(obj.el);
      setupMaterialDesign(obj);
    });
  }
}

function createButtonWithTooltip(item) {
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

  const ripple = document.createElement("div");
  ripple.classList.add("mdc-icon-button__ripple");
  const focusRing = document.createElement("span");
  focusRing.classList.add("mdc-icon-button__focus-ring");
  iconButton.append(ripple, focusRing, item.icon);

  if (item.id == "tooltip-inertify") {
    iconButton.addEventListener("click", (e) => {
      //if (card.mode == "read") {
      console.log(`inertify button clicked`);
      //}
    });
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
  //buttonBar.append(el);

  return { el, iconButton, tooltip };
  //return buttonBar;
}

function setupMaterialDesign({ iconButton, tooltip }) {
  new MDCTooltip(tooltip);
  const iconButtonRipple = new MDCRipple(iconButton);
  iconButtonRipple.unbounded = true;
}

export default attachButtonBar;
