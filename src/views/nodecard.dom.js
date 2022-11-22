
import { qs, render, div, setPosition } from "./dom-helpers"
import createButtonBar from "./button-bar";

export default function domViews(controllers) {
  
  // for discard and inertify>collapse
  
  const removeElement = (id) => {
    
    qs(id).remove();
    
  }
  
  // for cards
  
  const expand = ({ id, x, y, nestedState, text }) => {

    const el = div('nodecard', 'expand')

    el.id = id;

    render(el); // MUST RENDER BEFORE setPosition and fillElement are called!!!

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

  return {
    removeElement,
    setPosition,
    expand, 
    fillElement, 
    updateEditor, 
    collapse, 
    setPosition,
  }
}
