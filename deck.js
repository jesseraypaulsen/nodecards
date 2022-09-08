import Nodecard from "./nodecard";
import buildLink from "./link";
import { setupSwitchPanel, turnPhysicsOff } from "./switch-panel";
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
  const graphContainer = document.createElement("div");
  graphContainer.id = "graph-container";
  container.append(graphContainer);
  deck.container = graphContainer;
  deck.renderingOptions = options;  
  
  setupGraphRenderer(graphRenderer, deck);
  setupSwitchPanel(deck);
  setListener(deck, handler);
  setupNodecards(deck, setupLinks);
};

function setupGraphRenderer(graphRenderer, deck) {
  const options = deck.renderingOptions;
  deck.net = new graphRenderer.Network(deck.container, {}, options);
  //deck.net.fit({ maxZoomLevel: 1, minZoomLevel: 0.6 });
  //TODO: deck.graphRenderer = new graphRendererFacade(vis);
}

function setListener(deck, handler) {
  deck.listener = (e) => handler(e, deck);
  deck.net.on("click", deck.listener);
  deck.net.on("dragging", (e) => {
    console.log(`here's dragging event for the canvas renderer (see deck.js -> setListener)`)
    console.log(e)
  })
}

async function setupNodecards(deck, callback) {
  data.nodecards.map((item, i) => {
    const options = {
      id: item.id,
      text: item.body,
      title: item.title,
      webSource: item.source,
      pt: item.pt,
      state: "fixed",
      mode: "inert",
      prelines: true,
      canvasFont: { size: item.size }
    };

    if (deck.settings.physics) {
      setTimeout(() => {
        deck.hydrateCard(options);
        if (i === data.nodecards.length - 1) {
          callback(deck);
        }
      }, i * 35);
    } else {
      deck.hydrateCard(options);
      if (i === data.nodecards.length - 1) {
        callback(deck);
      }
    }
  });
}

async function setupLinks(deck) {
  data.links.map((item, i) => {
    const options = {
      source: item._from,
      target: item._to,
      edgetype: item.edgetype,
      id: item.id,
    };
    deck.hydrateLink(options);
  });
  deck.net.fit({ maxZoomLevel: 1, minZoomLevel: 0.6 });
  if (deck.settings.physics) {
    setTimeout(() => {
      turnPhysicsOff();
    }, 4000)
  }
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
  const link = buildLink(options);
  const id = cuid(); //create new id
  link.setId(id);
  link.addToDeck();
  link.render();
};

Deck.prototype.hydrateLink = function ({ source, target, edgetype, id }) {
  const options = { sourceId: source, targetId: target, edgetype, deck: this };
  const link = buildLink(options);
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

  this.currCard = { state: "empty" };
};

Deck.prototype.getNodeCenter = function (id) {
  let canvas = this.net.getPosition(id);
  let dom = this.net.canvasToDOM({ x: canvas.x, y: canvas.y });
  return { canX: canvas.x, canY: canvas.y, domX: dom.x, domY: dom.y };
};
