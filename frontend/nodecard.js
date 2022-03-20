export default Nodecard;
import attachButtonBar from "./button-bar";
import { updateNodecardDbEntry } from "./data-access";

function Nodecard(o) {
  this.id = o.id;
  this.state = o.state || "floating";
  this.mode = o.mode || "write";
  this.text = o.text;
  this.title = limitLength(o.text) || "untitled";
  this.deck = o.deck || null;
  this.databaseId = o.databaseId || null;
  this.databaseKey = o.databaseKey || null;
  this.dom = null; // see render for the creation of this value
  this.previousMode = null;

  addNodeThenRender(o.pt, o.id, o.text, o.deck, this);
}

function addNodeThenRender(pt, id, text, deck, card) {
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
      let timeoutId;
      this.dom.addEventListener("keyup", (e) => {
        if (this.state === "floating") this.state = "fixed";
        this.text = e.target.value;
        // since title is only derived from body (for now), we need to update the title,
        // especially for newly created cards that have no body when they are instantiated.
        let newTitle = limitLength(this.text);
        if (this.title !== newTitle) this.title = newTitle;
        if (this.deck.settings.write && this.deck.settings.save) {
          if (this.databaseKey) {
            const { databaseKey } = this;
            //databaseKey will not exist if nodecard creation on the database is incomplete.
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              updateNodecardDbEntry(databaseKey, this.text);
            }, 750);
          }
        }
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
  bodyContainer.textContent = this.text;

  //const buttonBar = attachButtonBar();
  //buttonBar.classList.add("nodecard__bar");

  reader.append(bodyContainer);
  //reader.append(bodyContainer, buttonBar);

  return reader;
};

Nodecard.prototype.editor = function () {
  const editor = document.createElement("div");
  editor.classList.add("editor");
  //editor.innerHTML = `<textarea cols="16" rows="12" placeholder="start typing..."></textarea>`;
  editor.innerHTML = `<textarea placeholder="start typing..."></textarea>`;
  return editor;
};

// used by .move and .render
Nodecard.prototype.setPosition = function (x, y) {
  this.dom.style.left = x - 200 / 2 + "px"; // height, width = 100 in styles.css
  this.dom.style.top = y - 200 / 2 + "px";
  this.dom.style.display = "flex";
};

Nodecard.prototype.log = function () {
  const on = true;
  if (on) {
    console.log(`rendering ${this.id} in ${this.mode} mode`);
  }
};

// find the center point of a DOM element
function centerpoint(el) {
  let centerX = el.offsetLeft + el.offsetWidth / 2;
  let centerY = el.offsetTop + el.offsetHeight / 2; // find the centerpoint of an element.
  console.log(`centerX: ${centerX} / centerY: ${centerY}`); // should be equal to click coords.
}

function limitLength(txt) {
  if (!txt) return false;
  if (txt.length <= 20) return txt;
  return txt.slice(0, 20);
}

/*
Nodecard.prototype.canvasTextWrap = (txt, unit) => {
  txt = limitLength(txt);
  const lines = [];
  const reducer = (acc, curr) => acc + curr;
  let breaks = Math.ceil(txt.length / unit); // round up to nearest integer
  for (let n = 0; n < breaks; n++) {
    let nu = n * unit;
    lines[n] = txt.substring(nu, nu + unit) + "\n\n";
    // vis-network simply uses the line-break character to format multi-line text on canvas
  }
  let wrappedtxt = lines.reduce(reducer);
  return wrappedtxt;
};
*/
