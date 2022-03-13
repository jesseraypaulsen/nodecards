import { setPhysics } from "./utils";

export function setupSwitchPanel(deck) {
  const cp = document.createElement("div");
  cp.classList.add("control-panel");
  deck.container.append(cp);

  cp.innerHTML = `
  <div class="cp-dropdown-btn">&#9881;</div>
  <div class="cp-dropdown">
  <label class="switch read">
  <input type="checkbox" />
  <span class="toggler-switch">Reading Off</span>
  </label>
  <label class="switch write">
  <input type="checkbox" />
  <span class="toggler-switch">Writing Off</span>
  </label>
  <label class="switch nonlinear">
  <input type="checkbox" />
  <span class="toggler-switch">Nonlinear Writing Off</span>
  </label>
  <label class="switch save">
  <input type="checkbox" />
  <span class="toggler-switch">Auto-save Off</span>
  </label>    
  <label class="switch physics">
    <input type="checkbox" />
    <span class="toggler-switch">Physics Off</span>
  </label>
  </div>
  `;
  const switches = deck.container.querySelectorAll(".switch");

  const switchHandler = (e) => {
    const chkValue = e.target.checked;
    const parent = e.target.parentNode;
    const sibling = e.target.nextElementSibling;

    const switchLabel = (stringVal, chkVal) => {
      stringVal += chkVal ? " On" : " Off";
      sibling.innerText = stringVal;
    };
    if (parent.classList.contains("physics")) {
      deck.settings.physics = chkValue;
      setPhysics(chkValue, deck);
      switchLabel("Physics", chkValue);
      console.log(deck.settings);
    } else if (parent.classList.contains("nonlinear")) {
      deck.settings.nonlinear = chkValue;
      switchLabel("Nonlinear Writing", chkValue);
      //nonlinear is dependent on writing, so this synchronizes the toggles.
      const el = parent.parentNode.querySelector(".write").firstElementChild;
      el.checked = chkValue; //required: assign new state before dispatching change event
      const ev = new Event("change");
      el.dispatchEvent(ev);
    } else if (parent.classList.contains("read")) {
      deck.settings.read = chkValue;
      switchLabel("Reading", chkValue);
    } else if (parent.classList.contains("write")) {
      deck.settings.write = chkValue;
      switchLabel("Writing", chkValue);
    } else if (parent.classList.contains("save")) {
      deck.settings.save = chkValue;
      switchLabel("Auto-save", chkValue);
    }
  };

  switches.forEach((s) => {
    s.firstElementChild.addEventListener("change", switchHandler);
  });
}

// turn off physics via switch, to keep the renderer's physics setting in synch with switch state.
// see nonlinear-handler.
export function turnTogglerSwitchOff() {
  const togglerSwitch = document.querySelector(".physics").firstElementChild;
  togglerSwitch.checked = false;

  let e = new Event("change");
  togglerSwitch.dispatchEvent(e);
}
