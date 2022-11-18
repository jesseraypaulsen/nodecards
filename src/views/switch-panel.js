export function setupSwitchPanel(app) {
  const cp = document.createElement("div");
  cp.classList.add("control-panel");
  app.container.append(cp);

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

      <select class="app-modes">
        <option value="APP.READONLY">Read Only</option>
        <option value="APP.MODIFIABLE">Modify</option>
        <option value="APP.DISABLE">Disable</option>
      </select>

    </div>
  `;

  
  const closeButton = document.querySelector(".close-button");
  const dropDownButton = document.querySelector(".cp-dropdown-btn");
  const physicsSwitch = document.querySelector(".physics").firstElementChild;
  const persistSwitch = document.querySelector(".persist").firstElementChild;
  const selectMode = document.querySelector(".app-modes");
 
  const closeHandler = (e) => {
    dropDownButton.style.display = "block";
    e.target.parentNode.style.display = "none";
  }

  const dropDownHandler = (e) => {
    e.target.nextElementSibling.style.display = "flex";
    e.target.style.display = "none";
  }

  const physicsHandler = (e) => {
    app.controllers.panel.physics(e)
  }

  const persistHandler = (e) => {
    app.controllers.panel.persist(e)
  };

  const selectHandler = (e) => {
    app.controllers.panel.select(e)
  }

  closeButton.addEventListener('click', closeHandler);
  dropDownButton.addEventListener('click', dropDownHandler);
  physicsSwitch.addEventListener('change', physicsHandler);
  persistSwitch.addEventListener('change', persistHandler);
  selectMode.addEventListener('change', selectHandler);
  
}
