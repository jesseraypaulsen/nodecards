export function setupSwitchPanel(deck) {
  const cp = document.createElement("div");
  cp.classList.add("control-panel");
  deck.container.append(cp);

  cp.innerHTML = `
    <div class="cp-dropdown-btn">&#9881;</div>
    <div class="cp-dropdown">

      <span class="close-button">x</span>

      <label class="switch persist">
        <input type="checkbox" />
        <span class="toggler-switch">Persist</span>
      </label>

      <label class="switch physics">
        <input type="checkbox" />
        <span class="toggler-switch">Physics</span>
      </label>

      <select class="deck-modes">
        <option value="DECK.READONLY">Read Only</option>
        <option value="DECK.MODIFIABLE">Modify</option>
        <option value="DECK.DISABLE">Disable</option>
      </select>

    </div>
  `;

  
  const closeButton = document.querySelector(".close-button");
  const dropDownButton = document.querySelector(".cp-dropdown-btn");
  const physicsSwitch = document.querySelector(".physics").firstElementChild;
  const persistSwitch = document.querySelector(".persist").firstElementChild;
  const selectMode = document.querySelector(".deck-modes");
 
  const closeHandler = (e) => {
    dropDownButton.style.display = "block";
    e.target.parentNode.style.display = "none";
  }

  const dropDownHandler = (e) => {
    e.target.nextElementSibling.style.display = "flex";
    e.target.style.display = "none";
  }

  const userEvent = (type) => ({ type, sentByUser: true })

  const physicsHandler = (e) => {
    const chkValue = e.target.checked;
    chkValue ? deck.send(userEvent('PHYSICS.ON')) : deck.send(userEvent('PHYSICS.OFF'));
  }

  const persistHandler = (e) => {
    const chkValue = e.target.checked;
    chkValue ? deck.send('PERSIST.ON') : deck.send('PERSIST.OFF');
  };

  const selectHandler = (e) => {
    deck.send(userEvent(e.target.value))
  }

  closeButton.addEventListener('click', closeHandler);
  dropDownButton.addEventListener('click', dropDownHandler);
  physicsSwitch.addEventListener('change', physicsHandler);
  persistSwitch.addEventListener('change', persistHandler);
  selectMode.addEventListener('change', selectHandler);
  
}
