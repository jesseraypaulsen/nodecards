export default Nodecard;
import attachButtonBar from "./button-bar";

function Nodecard(o) {
  let htmlText = o.text
    .replace(/\n/g, "<br>")
    .replace(/\t/g, "&nbsp; &nbsp; &nbsp; &nbsp;");
  this.id = o.id;
  this.state = o.state || "floating";
  this.mode = o.mode || "write";
  this.htmlText = htmlText || "";
  this.text = o.text || "";
  this.title = o.title || limitLength(o.text) || "untitled";
  this.deck = o.deck || null;
  this.databaseId = o.databaseId || null;
  this.databaseKey = o.databaseKey || null;
  this.dom = null; // see render for the creation of this value
  this.previousMode = null;

  addNodeThenRender(o.pt, o.id, o.deck, this);
}

function addNodeThenRender(pt, id, deck, card) {
  const label = card.title;
  if (pt) {
    deck.net.body.data.nodes.add({ x: pt.canX, y: pt.canY, id, label });
  } else {
    deck.net.body.data.nodes.add({ id, label });
  }
  card.pt = deck.getNodeCenter(id);
}

Nodecard.prototype.setMode = function (mode) {
  this.previousMode = this.mode;
  this.mode = mode || this.mode;

  if (this.mode === "write") {
    if (this.deck.settings.write) {
      this.log();

      let view = this.editor();
      this.render(view);

      // why does `this` return the nodecard instead of the dom element?
      // Because the dom element is attached to the nodecard. This is different than the
      // closebutton method below.
      this.dom.addEventListener("keyup", (e) => {
        if (this.state === "floating") this.state = "fixed";
        this.text = e.target.value;
        // since title is only derived from body (for now), we need to update the title,
        // especially for newly created cards that have no body when they are instantiated.
        let newTitle = limitLength(this.text);
        if (this.title !== newTitle) this.title = newTitle;
      });

      return;
    }
  }

  if (this.mode === "read") {
    if (this.deck.settings.read) {
      this.log();

      let view = this.reader();
      this.pt = this.deck.getNodeCenter(this.id);
      this.render(view);
      return;
    }
  }

  if (this.mode === "inert") {
    this.log();

    if (this.dom) this.dom.remove();

    this.deck.net.body.data.nodes.update({
      id: this.id,
      label: this.title,
      shape: "box",
      font: { size: 10 },
      shadow: true,
      opacity: 1,
    });

    return;
  }

  if (!this.mode) {
    console.error(`the card can't render until the mode is defined!`);
  }
};

Nodecard.prototype.render = function (view) {
  if (!this.dom) {
    this.dom = document.createElement("div");
    this.dom.classList.add("nodecard");
  }
  // make canvas node less visible. can't use the hidden property because it turns edges off.
  this.deck.net.body.data.nodes.update({
    id: this.id,
    label: "",
    shape: "square",
    shadow: false,
    size: 1,
    opacity: 0,
  });

  if (this.dom.hasChildNodes()) {
    let child = this.dom.firstElementChild;
    child.replaceWith(view);
  } else {
    this.dom.append(view);
  }
  //These two lines must occur in this order, or Material Tooltip breaks everything.
  this.deck.container.append(this.dom);
  attachButtonBar(view, this);

  this.setPosition(this.pt.domX, this.pt.domY);
};

Nodecard.prototype.move = function ({ domX, domY, canX, canY }) {
  this.deck.net.moveNode(this.id, canX, canY);
  this.setPosition(domX, domY);
};

Nodecard.prototype.reader = function () {
  const reader = document.createElement("div");
  reader.classList.add("reader");

  const bodyContainer = document.createElement("div");
  bodyContainer.classList.add("reader__body");
  //bodyContainer.textContent = this.text;
  bodyContainer.innerHTML = this.htmlText;

  reader.append(bodyContainer);
  return reader;
};

Nodecard.prototype.editor = function () {
  const editor = document.createElement("div");
  editor.classList.add("editor");

  const inputContainer = document.createElement("div");
  inputContainer.classList.add("editor__input");
  inputContainer.innerHTML = `<textarea placeholder="start typing...">${this.text}</textarea>`;

  editor.append(inputContainer);
  return editor;
};

// used by .move and .render
Nodecard.prototype.setPosition = function (x, y) {
  let width = parseInt(getComputedStyle(this.dom).width.substring(0, 3));
  let height = parseInt(getComputedStyle(this.dom).height.substring(0, 3));

  this.dom.style.left = x - width / 2 + "px";
  this.dom.style.top = y - height / 2 + "px";
  this.dom.style.display = "flex";

  /* to confirm that values are correct:
  console.log(`x is ${x}, y is ${y}, width is ${width}, height is ${height}`);
  centerpoint(this.dom);
  */
};

Nodecard.prototype.log = function () {
  const on = true;
  if (on) {
    console.log(`rendering ${this.id} in ${this.mode} mode`);
  }
};

function limitLength(txt) {
  if (!txt) return false;
  if (txt.length <= 20) return txt;
  return txt.slice(0, 20);
}

// Finds the center point of a DOM element. DO NOT DELETE, even if you're not currently using it.
// It's very useful for confirming that setPosition has computed the correct values.
function centerpoint(el) {
  let centerX = el.offsetLeft + el.offsetWidth / 2;
  let centerY = el.offsetTop + el.offsetHeight / 2; // find the centerpoint of an element.
  console.log(`centerX: ${centerX} / centerY: ${centerY}`); // should be equal to click coords.
}
