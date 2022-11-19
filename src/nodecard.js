import attachButtonBar from "./views/button-bar.js";

export default class Nodecard {
  constructor(id, app) {
    this.id = id;
    this.domElement = null;
    this.app = app;
    this.type = null; // block-card, page-card, table-card
    this.roles = []; // one for each context (ie app)
  }

  // methods that operate on the DOM exclusively

  open({ x, y, nestedState, text }) {
    this.domElement = document.createElement("div");
    this.domElement.classList.add("nodecard", "expand");

    this.renderState(nestedState, text);
    this.app.container.append(this.domElement);
    //const { domX, domY } = this.getNodeCenter();
    this.app.setPosition(this.domElement, x, y);
  }
  
  renderState(state, text) {
 
    const view = this[state](text);

    if (this.domElement.hasChildNodes()) {
      let child = this.domElement.firstElementChild;
      child.replaceWith(view);
    } else {
      this.domElement.append(view);
    }

    attachButtonBar(this, state);
  }
  
  read(text) {
    const reader = document.createElement("div");
    reader.classList.add("reader");
    reader.innerHTML = this.htmlText(text);
    return reader;
  }
  
  edit(text) {
    const editor = document.createElement("textarea");
    editor.classList.add("editor");
    editor.value = text;
    editor.addEventListener('input', (e) => {
      this.app.controllers.editor(e, this.id)
    })
    return editor;
  }
  
  updateEditor(event) {
    this.domElement.firstElementChild.value = event.text;
  }
  
  htmlText(text) {
    if (text) {
      return text
      .replace(/\n/g, "<br>")
      .replace(/\t/g, "&nbsp; &nbsp; &nbsp; &nbsp;");
    }
  }
  
  // methods that bridge the DOM and graph renderer

  getNodeCenter() {
    let canvas = this.app.graphRenderer.getPosition(this.id);
    let dom = this.app.graphRenderer.canvasToDOM({ x: canvas.x, y: canvas.y });
    return { canX: canvas.x, canY: canvas.y, domX: dom.x, domY: dom.y };
  }
  
  move({ domX, domY, canX, canY }) {
    this.app.graphRenderer.moveNode(this.id, canX, canY);
    this.app.setPosition(this.domElement, domX, domY);
  }

  inertify(state) {
    if (this.domElement) {
      
      this.domElement.classList.replace("expand", "contract")
      
      // delay the removal of the DOM element, otherwise the contract animation doesn't occur
      setTimeout(() => {
        this.domElement.remove();
        this.domElement = null;
      }, 600);
    }

    // TODO: find out if this necessary or not
    this.app.graphRenderer.body.data.nodes.update({
      id: this.id,
      label: state.context.label,
      shape: "box",
      //font: this.canvasFont,
      shadow: true,
      opacity: 1,
    });
  }

  discard() {
    // Note: The CARD.DELETE transition deletes the card's data from the state machine's context before this method is called.

    //remove element from dom
    this.domElement.remove();

    //remove node from renderer
    this.app.graphRenderer.body.data.nodes.remove(this.id);

    //remove card from app
    this.app.nodecards.forEach((n, i) => {
      if (n.id === this.id) {
        this.app.nodecards.splice(i, 1);
      }
    });
  }


}
