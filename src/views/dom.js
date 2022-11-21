
import { qs, render, div } from "./dom-helpers"
import createButtonBar from "../views/button-bar";

export default function domViews(controllers) {
  
  // for discard and inertify>collapse
  
  const removeElement = (id) => {
    
    qs(id).remove();
    
  }
  
  // for cards
  
  const expand = ({ id, x, y, nestedState, text }) => {
    console.log(id, x, y, nestedState, text)
    const el = div('nodecard', 'expand')
    el.id = id;
    render(el); // MUST RENDER BEFORE setPosition and fillElement!!!!!!!!!!
    setPosition(el, x, y);
    fillElement(id, nestedState, text);
  }
  
  const fillElement = (id, state, text) => {
    const el = qs('#' + id)
    const choice = chooseView(id, state, text);
    
    //TODO: add source argument
    const source = null;
    const bar = createButtonBar(state, source, controllers)
    
    insertView(el, choice);
    
    insertBar(el, bar);
    
  }
  
  const insertView = (parent, view) => {
    
    if (parent.hasChildNodes())
    
    parent.firstElementChild.replaceWith(view);
    
    else 
    
    render(view, parent);
    
  }
  
  const insertBar = (parent, bar) => {
    
    if (parent.lastElementChild.classList.contains("button-bar")) {
      
      //parent.lastElementChild.remove();
      parent.lastElementChild.replaceWith(bar)
      
    }
    
    else
    
    render(bar, parent)
    
  }
  
  const chooseView = (id, state, text) => {
    console.log(state)
    let choose = { 
      read: (text) => {
        const reader = div("reader")
        reader.innerHTML = htmlText(text);
        return reader
      },
      edit: (text) => {
        const editor = document.createElement("textarea");
        editor.classList.add("editor");
        editor.value = text;
        editor.addEventListener('input', (e) => {
          controllers.editor(e, id)
        })
        return editor;
      }
    }
    
    return choose[state](text)
    
  }
  
  const updateEditor = ({ text, id }) => {
    
    // is this even necessary??
 
    qs('#' + id).firstElementChild.value = text;
    
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
    id = '#' + id;
    if (qs(id)) {
      
      qs(id).classList.replace("expand", "contract")
      
      // delay the removal of the DOM element, otherwise the contract animation doesn't occur
      setTimeout(() => {
        removeElement(id)
      }, 600);
    }
  }
  
  // peripherals
  
  const openPrompt = ({ x, y }) => {
  
    const prompt = div("creation-prompt");
    
    prompt.innerHTML = `<span>x</span><span>Create Card</span>`
    
    render(prompt); //append must occur before setPosition
    
    setPosition(prompt, x, y)
    
    prompt.firstElementChild.addEventListener('click', () => controllers.prompt.close())
    
  }
  
  const closePrompt = () => {
    
    const prompt = qs(".creation-prompt");
    
    if (prompt) prompt.remove();
    
  }
  
  const setPosition = (element, x, y) => {
    console.log('setPosition:', element, x, y)
  
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
  
  
  const synchPanel = (event) => {
  
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

  return {
    removeElement,
    setPosition,
    expand, 
    fillElement, 
    updateEditor, 
    collapse, 
    openPrompt, 
    closePrompt, 
    synchPanel 
  }
}
