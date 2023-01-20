import { qs, render, div } from "./dom-helpers";

export function settingsPanel(controllers) {
  const cp = div("control-panel");

  const obj = {
    "cp-dropdown-btn": [
      "click",
      (e) => {
        e.target.nextElementSibling.style.display = "flex";
        e.target.style.display = "none";
      },
    ],
    "close-button": [
      "click",
      (e) => {
        qs(".cp-dropdown-btn").style.display = "block";
        e.target.parentNode.style.display = "none";
      },
    ],
    appMode: [
      "change",
      (e) => {
        controllers.appMode(e);
      },
      true,
    ],
    physics: [
      "change",
      (e) => {
        controllers.physics(e);
      },
      true,
    ],
  };

  const classes = Object.keys(obj);

  let template = `
      <div class="${classes[0]}">&#9881;</div>
      <div class="cp-dropdown">
  
        <span class="${classes[1]}">x</span>
  
        <label class="switch ${classes[2]}">
          <input type="checkbox" checked/>
          <span class="toggler-switch">App Mode</span>
        </label>
  
        <label class="switch ${classes[3]}">
          <input type="checkbox" />
          <span class="toggler-switch">Physics</span>
        </label>
        
      </div>
        `;

  cp.innerHTML = template;

  render(cp);

  for (let key in obj) {
    const items = obj[key];
    const className = "." + key;
    let el;
    if (items[2]) el = qs(className).firstElementChild;
    else el = qs(className);
    el.addEventListener(items[0], items[1]);
  }
}

export const synchPanel = (event) => {
  //like "controlled components", their internal state should be in sync with app state

  if (event.type === "turnPhysicsOff" && !event.sentByUser) {
    //not sent by user! change toggler to reflect the state!
    qs(".physics").firstElementChild.checked = false;
  }

  if (event.type === "APP.DISABLE" && !event.sentByUser) {
    //not sent by user! change value of select element to reflect the state!
    qs(".appMode").firstElementChild.checked = false;
  }
};
