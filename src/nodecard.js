import createButtonBar from "./views/button-bar.js";
import { qs, render, setPosition } from './views/dom'

export default class Nodecard {
  constructor(app) {
    this.app = app;
  }

  // methods that operate on the DOM exclusively

  open({ id, x, y, nestedState, text }) {
    const el = document.createElement("div");
    el.classList.add("nodecard", "expand");
    el.id = id;

    render(el)
    this.renderState(nestedState, text, id);

    setPosition(el, x, y);
  }
  
  renderState(state, text, id) {
 
    const view = this[state](text, id);
    console.log(state)

    const parent = qs('#' + id);
    
    if (parent.hasChildNodes()) {
      let child = parent.firstElementChild;
      child.replaceWith(view);
    } else {
      parent.append(view);
    }
    
    //TODO: add source argument
    const source = null;
    const bar = createButtonBar(id, state, source, this.app.controllers)

    if (parent.lastElementChild.classList.contains("button-bar")) {
      parent.lastElementChild.remove();
    }

    render(bar, parent)

  }
  
  read(text) {
    const reader = document.createElement("div");
    reader.classList.add("reader");
    reader.innerHTML = this.htmlText(text);
    return reader;
  }
  
  edit(text, id) {
    const editor = document.createElement("textarea");
    editor.classList.add("editor");
    editor.value = text;
    editor.addEventListener('input', (e) => {
      this.app.controllers.editor(e, id)
    })
    return editor;
  }
  
  updateEditor(text, id) {
    qs('#' + id).firstElementChild.value = text;
  }
  
  htmlText(text) {
    if (text) {
      return text
      .replace(/\n/g, "<br>")
      .replace(/\t/g, "&nbsp; &nbsp; &nbsp; &nbsp;");
    }
  }
  
  // methods that bridge the DOM and graph renderer

  getNodeCenter(id) {
    let canvas = this.app.graphRenderer.getPosition(id);
    let dom = this.app.graphRenderer.canvasToDOM({ x: canvas.x, y: canvas.y });
    return { canX: canvas.x, canY: canvas.y, domX: dom.x, domY: dom.y };
  }
  
  move(id, { domX, domY, canX, canY }) {
    this.app.graphRenderer.moveNode(id, canX, canY);
    setPosition(this.domElement, domX, domY);
  }

  inertify(label, id) {
    const el = qs('#' + id);
    if (el) {
      
      el.classList.replace("expand", "contract")
      
      // delay the removal of the DOM element, otherwise the contract animation doesn't occur
      setTimeout(() => {
        el.remove();
      }, 600);
    }

    // TODO: find out if this necessary or not
    this.app.graphRenderer.body.data.nodes.update({
      id,
      label,
      shape: "box",
      //font: this.canvasFont,
      shadow: true,
      opacity: 1,
    });
  }

  discard(id) {
    // Note: The CARD.DELETE transition deletes the card's data from the state machine's context before this method is called.

    //remove element from dom
    //this.domElement.remove();
    qs('#' + id).remove();

    //remove node from renderer
    this.app.graphRenderer.body.data.nodes.remove(id);

    //remove card from app
    this.app.nodecards.forEach((n, i) => {
      if (n.id === id) {
        this.app.nodecards.splice(i, 1);
      }
    });
  }


}
