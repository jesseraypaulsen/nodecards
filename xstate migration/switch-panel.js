export function setupSwitchPanel(deck) {
  const cp = document.createElement("div");
  cp.classList.add("control-panel");
  deck.container.append(cp);

  cp.innerHTML = `
  <div class="cp-dropdown-btn">&#9881;</div>
  <div class="cp-dropdown">

    <label class="switch persist">
      <input type="checkbox" />
      <span class="toggler-switch">Persist</span>
    </label>

    <label class="switch physics">
      <input type="checkbox" />
      <span class="toggler-switch">Physics</span>
    </label>

    <select>
      <option>Read Only</option>
      <option>Modify</option>
      <option>Disable</option>
    </select>

  </div>
  `;

  const physHandler = (e) => {
    const chkValue = e.target.checked;
    //deck.settings.physics = chkValue; 
    chkValue ? deck.send('PHYSICS.ON') : deck.send('PHYSICS.OFF');
    //setPhysics(chkValue, deck); // move to deck.render
  }

  const persHandler = (e) => {
    const chkValue = e.target.checked;
    //deck.settings.save = chkValue;
    chkValue ? deck.send('PERSIST.ON') : deck.send('PERSIST.OFF');
  };
  
  
  /*
  const parent = e.target.parentNode;
  const sibling = e.target.nextElementSibling;
  if (parent.classList.contains("nonlinear")) {

    deck.settings.nonlinear = chkValue;
    //nonlinear is dependent on writing, so this synchronizes the toggles.
    const el = parent.parentNode.querySelector(".write").firstElementChild;
    el.checked = chkValue; //required: assign new state before dispatching change event
    const ev = new Event("change");
    el.dispatchEvent(ev);
  } 
  */

  const physSwitch = document.querySelector(".physics").firstElementChild;
  physSwitch.addEventListener('change', physHandler)

  const persSwitch = document.querySelector(".persist").firstElementChild;
  persSwitch.addEventListener('change', persHandler)
  

}

// turn off physics via switch, to keep the renderer's physics setting in synch with switch state.
// see nonlinear-handler.
export function turnPhysicsOff() {
  const togglerSwitch = document.querySelector(".physics").firstElementChild;
  togglerSwitch.checked = false;

  let e = new Event("change");
  togglerSwitch.dispatchEvent(e);
}
