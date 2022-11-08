import attachButtonBar from "./button-bar.js";

export default class Nodecard {
  constructor(id, deck) {
    this.id = id;
    this.domElement = null;
    this.deck = deck;
  }

  open(state) {
    this.domElement = document.createElement("div");
    this.domElement.classList.add("nodecard", "expand");
    this.renderState(state);
    this.deck.container.append(this.domElement);
    const { domX, domY } = this.getNodeCenter();
    this.deck.setPosition(this.domElement, domX, domY);
  }

  getNodeCenter() {
    let canvas = this.deck.graphRenderer.getPosition(this.id);
    let dom = this.deck.graphRenderer.canvasToDOM({ x: canvas.x, y: canvas.y });
    return { canX: canvas.x, canY: canvas.y, domX: dom.x, domY: dom.y };
  }

  move({ domX, domY, canX, canY }) {
    this.deck.graphRenderer.moveNode(this.id, canX, canY);
    this.deck.setPosition(this.domElement, domX, domY);
  }

  renderState(state) {
    const view = this[state.value.active](state);
    if (this.domElement.hasChildNodes()) {
      let child = this.domElement.firstElementChild;
      child.replaceWith(view);
    } else {
      this.domElement.append(view);
    }
    attachButtonBar(this, state.value.active);
  }

  read(state) {
    const reader = document.createElement("div");
    reader.classList.add("reader");
    reader.innerHTML = this.htmlText(state.context.text);
    return reader;
  }

  edit(state) {
    const editor = document.createElement("textarea");
    editor.classList.add("editor");
    editor.value = state.context.text;
    editor.addEventListener('input', (e) => {
      this.deck.send({ type: "CARD.EDIT.TYPING", text: e.target.value, id: this.id })
    })
    return editor;
  }

  updateEditor(event) {
    this.domElement.firstElementChild.value = event.text;
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

    this.deck.graphRenderer.body.data.nodes.update({
      id: this.id,
      label: state.context.label,
      shape: "box",
      //font: this.canvasFont,
      shadow: true,
      opacity: 1,
    });
  }

  discard() {
    //TODO: remove card from state machine context

    //remove element from dom
    this.domElement.remove();

    //remove node from renderer
    this.deck.graphRenderer.body.data.nodes.remove(this.id);

    //remove card from deck
    this.deck.nodecards.forEach((n, i) => {
      if (n.id === this.id) {
        this.deck.nodecards.splice(i, 1);
      }
    });
  }

  htmlText(text) {
    if (text) {
      return text
        .replace(/\n/g, "<br>")
        .replace(/\t/g, "&nbsp; &nbsp; &nbsp; &nbsp;");
    }
  }

}
