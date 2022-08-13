import Nodecard from "./nodecard";
import buildLink from "./link";
import { setupSwitchPanel } from "./switch-panel";
import cuid from "cuid";
const data = require("./data.json");

export default function Deck() {
  this.stack = [];
  this.links = [];
  this.currCard = { state: "empty" };
  this.listener = null;
  this.net = null;
  this.container = null;
  this.renderingOptions = null;
  this.settings = {
    read: false,
    write: false,
    nonlinear: false,
    save: false,
    physics: false,
  };
}

// static factory method
Deck.initialize = function (container, options, handler, graphRenderer) {
  const deck = new Deck();
  deck.container = container;
  deck.renderingOptions = options;
  setupGraphRenderer(graphRenderer, deck);
  setupSwitchPanel(deck);
  setListener(deck, handler);
  setupNodecards(deck, setupLinks);
};

function setupGraphRenderer(graphRenderer, deck) {
  const graphContainer = document.createElement("div");
  graphContainer.id = "graph-container";
  deck.container.append(graphContainer);
  const options = deck.renderingOptions;
  deck.net = new graphRenderer.Network(graphContainer, {}, options);
  //TODO: deck.graphRenderer = new graphRendererFacade(vis);
}

function setListener(deck, handler) {
  deck.listener = (e) => handler(e, deck);
  deck.net.on("click", deck.listener);
}

async function setupNodecards(deck, callback) {
  data.nodecards.map((item, i) => {
    const options = {
      id: item.id,
      text: item.body,
      title: item.title,
      pt: null,
      state: "fixed",
      mode: "inert",
      prelines: true,
    };
    setTimeout(() => {
      deck.hydrateCard(options);
      if (i === data.nodecards.length - 1) {
        callback(deck);
      }
    }, i * 100);
  });
}

async function setupLinks(deck) {
  console.log(`setupLinks called`);
  data.links.map((item, i) => {
    const options = {
      source: item._from,
      target: item._to,
      edgetype: item.edgetype,
      id: item.id,
    };
    deck.hydrateLink(options);
  });
}

// coordinates provided by options; id not provided.
Deck.prototype.createCard = async function (options) {
  options.id = cuid();
  options.deck = this;
  const card = new Nodecard(options);
  card.setMode(); // render
  this.pushCard(card);
  // if (this.settings.write && this.settings.save) {
  //   await createDatabaseEntry(card);   <-- creates databaseId and databaseKey
  // }
  return card;
};

// id provided by options; coordinates not provided.
Deck.prototype.hydrateCard = function (options) {
  options.deck = this;
  const card = new Nodecard(options);
  this.pushCard(card);
};

Deck.prototype.createLink = function (options) {
  options.deck = this;
  console.log(`from createLink, here's options`);
  console.log(options); //edgetype:'tangent'
  const link = buildLink(options);
  const id = cuid(); //create new id
  link.setId(id);
  link.addToDeck();
  link.render();
};

Deck.prototype.hydrateLink = function ({ source, target, edgetype, id }) {
  const options = { sourceId: source, targetId: target, edgetype, deck: this };

  const link = buildLink(options);
  console.log(`${source}, ${target}`);
  link.setId(id);
  link.addToDeck();
  link.render();
};

Deck.prototype.getCard = function (id) {
  let card = this.stack.find((x) => x.id === id);
  if (!card)
    console.error(`the nodecard with id of ${id} cannot be found in the deck.`);
  return card;
};

Deck.prototype.pushCard = function (card) {
  this.stack.push(card);
};

Deck.prototype.discard = function (id) {
  //remove element from dom
  let card = this.getCard(id);
  card.dom.remove();

  //remove node from renderer
  this.net.body.data.nodes.remove(id);

  //remove card from deck
  this.stack.forEach((n, i) => {
    if (n.id === this.id) {
      this.stack.splice(i, 1);
    }
  });
};

Deck.prototype.getNodeCenter = function (id) {
  let canvas = this.net.getPosition(id);
  let dom = this.net.canvasToDOM({ x: canvas.x, y: canvas.y });
  return { canX: canvas.x, canY: canvas.y, domX: dom.x, domY: dom.y };
};
