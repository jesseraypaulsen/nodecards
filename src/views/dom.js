const qs = (id) => document.querySelector(id)
const render = (el) => qs('#container').append(el)

// for combo functions

// for discard and inertify>collapse

const removeElement = (id) => {
  qs(id).remove();
}

// for cards

const open = (state) => {

  // expand
  const el = document.createElement("div");
  el.classList.add("nodecard", "expand");

  // crossing into graph territory
  const { domX, domY } = getNodeCenter(id);
  
  setPosition(el, domX, domY);

  this.fillElement(el, state);

  render(el);
}

const fillElement = (el, state) => {

  const active = state.value.active;
  const text = state.context.text;

  const choice = chooseView(active, text);

  
  if (el.hasChildNodes())
  
    el.firstElementChild.replaceWith(choice);
    
    else 

    el.append(choice);
    
    
    
  attachButtonBar(this, active);
    
}

const chooseView = (state, text) => {
  
  let choose = { 
    read: (text) => {
      const reader = document.createElement("div");
      reader.classList.add("reader");
      reader.innerHTML = htmlText(text);
      return reader
    },
    edit: (text) => {
      const editor = document.createElement("textarea");
      editor.classList.add("editor");
      editor.value = text;
      editor.addEventListener('input', (e) => {
        this.app.send({ type: "CARD.EDIT.TYPING", text: e.target.value, id: this.id })
      })
      return editor;
    }
  }
  
  return choose[state](text)

}

const updateEditor = (event) => {

  //TODO: get id from XState event

  qs(id).value = event.text;

  //event.target.value = event.text; //wrong

  //this.domElement.firstElementChild.value = event.text; //wrong
}

const htmlText = (text) => {
  if (text) {
    return text
    .replace(/\n/g, "<br>")
    .replace(/\t/g, "&nbsp; &nbsp; &nbsp; &nbsp;");
  }
}

// for inertify
const collapse = (id) => {
  qs(id).replace("expand", "contract")
      
  // delay the removal of the DOM element, otherwise the contract animation doesn't occur
  setTimeout(() => {
    removeElement(id)
  }, 600);
}

// peripherals

const openPrompt = (event) => {
  
  // TODO: mediate graph event thru controller
  const { x, y } = event.data.pointer.DOM;

  const prompt = document.createElement("div");
  prompt.classList.add("creation-prompt");

  prompt.innerHTML = `<span>x</span><span>Create Card</span>`

  render(prompt); //append must occur before setPosition

  setPosition(prompt, x, y)

  prompt.firstElementChild.addEventListener('click', () => this.send('CLOSE.PROMPT'))

}

const closePrompt = () => {

  const prompt = qs(".creation-prompt");

  if (prompt) prompt.remove();

}

const setPosition = (element, x, y) => {

  let width = parseInt(
    getComputedStyle(element).width.substring(0, 3)
  );

  let height = parseInt(
    getComputedStyle(element).height.substring(0, 3)
  );

  element.style.left = x - width / 2 + "px";

  element.style.top = y - height / 2 + "px";

}

/* Finds the center point of an element relative to its offsetParent property. 
  Useful for corroborating setPosition values.
  DO NOT DELETE, even if it's not currently being used!! */
const centerpoint = (element) => {

  let centerX = element.offsetLeft + element.offsetWidth / 2;

  let centerY = element.offsetTop + element.offsetHeight / 2;

  console.log(`centerX: ${centerX} / centerY: ${centerY}`);

  // output should be equal to click event coordinates

}


const synchronizeSwitchPanelWithState = (event) => {

  //like "controlled components", their internal state should be in sync with app state
  
  if (event.type === "turnPhysicsOff" && !event.sentByUser) {
    //not sent by user! change toggler to reflect the state!
    qs('.physics').checked = false;
  }

  if (event.type === "APP.DISABLE" && !event.sentByUser) {
    //not sent by user! change value of select element to reflect the state!
    qs('.app-modes').value = "APP.DISABLE";
  }

}