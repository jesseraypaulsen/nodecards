export const qs = (sel) => document.querySelector(sel)

export const render = (el, container) => { 
  if (!container) container = qs('#container');
  container.append(el)
}

export const div = (...args) => {
  const el = document.createElement("div");
  el.classList.add(...args)
  return el;
}

// for combo functions

// for discard and inertify>collapse

export const removeElement = (id) => {
  qs(id).remove();
}

// for cards

export const expand = (state) => {

  const el = document.createElement("div");
  el.classList.add("nodecard", "expand");
  el.id = state.context.id;
  
  setPosition(el, domX, domY);

  fillElement(el, state);

  render(el);
}

export const fillElement = (el, state) => {

  const choice = chooseView(state, text);

  insertView(el, choice);
  
  attachButtonBar(this, state);
  
}

const insertView = (parent, view) => {
  if (parent.hasChildNodes())
  
    parent.firstElementChild.replaceWith(view);
    
  else 
  
  render(parent, view);
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
        this.app.controllers.editor(e, this.id)
      })
      return editor;
    }
  }
  
  return choose[state](text)

}

export const updateEditor = (event) => {

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
export const collapse = (id) => {
  qs(id).replace("expand", "contract")
      
  // delay the removal of the DOM element, otherwise the contract animation doesn't occur
  setTimeout(() => {
    removeElement(id)
  }, 600);
}

// peripherals

export const openPrompt = ({ x, y }, controller) => {

  const prompt = document.createElement("div");
  prompt.classList.add("creation-prompt");

  prompt.innerHTML = `<span>x</span><span>Create Card</span>`

  render(prompt); //append must occur before setPosition

  setPosition(prompt, x, y)

  prompt.firstElementChild.addEventListener('click', () => controller())

}

export const closePrompt = () => {

  const prompt = qs(".creation-prompt");

  if (prompt) prompt.remove();

}

export const setPosition = (element, x, y) => {

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
export const centerpoint = (element) => {

  let centerX = element.offsetLeft + element.offsetWidth / 2;

  let centerY = element.offsetTop + element.offsetHeight / 2;

  console.log(`centerX: ${centerX} / centerY: ${centerY}`);

  // output should be equal to click event coordinates

}


export const synchPanel = (event) => {

  //like "controlled components", their internal state should be in sync with app state
  
  if (event.type === "turnPhysicsOff" && !event.sentByUser) {
    //not sent by user! change toggler to reflect the state!
    qs('.physics').firstElementChild.checked = false;
  }

  if (event.type === "APP.DISABLE" && !event.sentByUser) {
    //not sent by user! change value of select element to reflect the state!
    qs('.app-modes').value = "APP.DISABLE";
  }

}