import { qs, render, div } from "./dom-helpers";

export function setupSwitchPanel(controllers) {

  const cp = div("control-panel");
  
  const obj = {
    "cp-dropdown-btn": [
      'click', 
      (e) => {
        e.target.nextElementSibling.style.display = "flex";
        e.target.style.display = "none";
      }
    ],
    "close-button": [
      'click', 
      (e) => {
        qs(".cp-dropdown-btn").style.display = "block";
        e.target.parentNode.style.display = "none";
      }
    ],
    "persist": [
      'change', 
      (e) => {
        controllers.persist(e)
      }, 
      true
    ],
    "physics": [
      'change', 
      (e) => {
        controllers.physics(e)
      }, 
      true
    ],
    "app-modes": [
      'change', 
      (e) => {
        controllers.select(e)
      }
    ]
  }
  
  const classes = Object.keys(obj);

  let template = `
    <div class="${classes[0]}">&#9881;</div>
    <div class="cp-dropdown">

      <span class="${classes[1]}">x</span>

      <label class="switch ${classes[2]}">
        <input type="checkbox" />
        <span class="toggler-switch">Persist</span>
      </label>

      <label class="switch ${classes[3]}">
        <input type="checkbox" />
        <span class="toggler-switch">Physics</span>
      </label>

      <select class="${classes[4]}">
        <option value="APP.READONLY">Read Only</option>
        <option value="APP.MODIFIABLE">Modify</option>
        <option value="APP.DISABLE">Disable</option>
      </select>

    </div>
  `;

  cp.innerHTML = template;

  render(cp);

  for (let key in obj) {
    const items = obj[key];
    const className = '.' + key;
    let el;
    if (items[2]) el = qs(className).firstElementChild;
    else el = qs(className)
    el.addEventListener(items[0], items[1])
  }
  
}
