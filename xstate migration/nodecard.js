import attachButtonBar from "./button-bar";

export default class Nodecard {
  constructor(id, deck) {
    this.id = id;
    this.domElement = null;
    this.deck = deck;
    this.container = deck.container;
    this.graphRenderer = deck.graphRenderer;
  }

  open(state) {
    this.domElement = document.createElement("div");
    this.domElement.classList.add("nodecard");
    this.domElement.classList.add("expand");
    this.renderState(state);
    this.container.append(this.domElement);
    const { domX, domY } = this.getNodeCenter();
    this.setPosition(domX, domY);
  }

  setPosition(x, y) {
    let width = parseInt(
      getComputedStyle(this.domElement).width.substring(0, 3)
    );
    let height = parseInt(
      getComputedStyle(this.domElement).height.substring(0, 3)
    );

    this.domElement.style.left = x - width / 2 + "px";
    this.domElement.style.top = y - height / 2 + "px";
    this.domElement.style.display = "flex";
  }

  getNodeCenter() {
    let canvas = this.graphRenderer.getPosition(this.id);
    let dom = this.graphRenderer.canvasToDOM({ x: canvas.x, y: canvas.y });
    return { canX: canvas.x, canY: canvas.y, domX: dom.x, domY: dom.y };
  }

  move({ domX, domY, canX, canY }) {
    this.graphRenderer.moveNode(this.id, canX, canY);
    this.setPosition(domX, domY);
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
      //this.deck.send({ type: "TYPING", value: e.target.value }) FAIL!!
      this.deck.send({ type: "CARD.EDIT.TYPING", text: e.target.value, id: this.id })
    })
    return editor;
  }

  inertify(state) {
    if (this.domElement) {
      this.domElement.classList.add("contract");
      // delay the removal of the DOM element, otherwise the contract animation doesn't occur
      setTimeout(() => {
        this.domElement.remove();
        this.domElement.classList.remove("contract");
        this.domElement.classList.add("expand");
      }, 800);
    }

    this.graphRenderer.body.data.nodes.update({
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
    this.graphRenderer.body.data.nodes.remove(this.id);

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

  /* Finds the center point of an element relative to its offsetParent property. 
     Useful for corroborating setPosition values.
     DO NOT DELETE, even if it's not currently being used!! */
  centerpoint() {
    let centerX = this.domElement.offsetLeft + this.domElement.offsetWidth / 2;
    let centerY = this.domElement.offsetTop + this.domElement.offsetHeight / 2;
    console.log(`centerX: ${centerX} / centerY: ${centerY}`);
    // output should be equal to click event coordinates
  }

  /*
  TODO: try to make method names correspond to state values to obviate the jungle of conditionals in deck.render, 
  eg read,edit,inert => card[state.value] 
  */
}
