import attachButtonBar from "./button-bar";

export default class Nodecard {
  constructor(id, label, text, deck) {
    this.id = id;
    this.label = label;
    this.text = text;
    this.domElement = null;
    this.deck = deck;
    this.container = deck.container;
    this.graphRenderer = deck.graphRenderer;
  }

  open({ active }) {
    console.log(`card ${this.id} opened for reading and writing!`);
    this.domElement = document.createElement("div");
    this.domElement.classList.add("nodecard");
    this.domElement.classList.add("expand");
    this.domElement.append(this[active]());
    this.container.append(this.domElement);
    const { domX, domY } = this.getNodeCenter();
    this.setPosition(domX, domY);
    attachButtonBar(this);
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

  read() {
    const reader = document.createElement("div");
    reader.classList.add("reader");
    reader.innerHTML = this.htmlText();
    return reader;
  }

  edit() {
    const editor = document.createElement("textarea");
    editor.classList.add("editor");
    editor.value = this.text;
    return editor;
  }

  inertify() {
    if (this.domElement) {
      this.domElement.classList.add("contract");
      // delay the removal of the DOM element, otherwise the contract animation doesn't occur
      setTimeout(() => {
        this.domElement.remove();
        this.domElement.classList.remove("contract");
        this.domElement.classList.add("expand");
      }, 300);
    }

    this.graphRenderer.body.data.nodes.update({
      id: this.id,
      label: this.label,
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

  htmlText() {
    if (this.text) {
      return this.text
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
