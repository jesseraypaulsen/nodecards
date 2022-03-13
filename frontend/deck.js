import Nodecard from "./nodecard";
import buildLink from "./link";
import { setupSwitchPanel } from "./switch-panel";
import cuid from "cuid";
import {
  getDbCollection,
  createNodecardDbEntry,
  createLinkDbEntry,
} from "./data-access";

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
Deck.initialize = async function (container, options, handler, graphRenderer) {
  const deck = new Deck();
  deck.container = container;
  deck.renderingOptions = options;
  const data = await getDbCollection("nodecards");
  //const links = await getDbCollection("links");
  const retrievedNodecards = data.map((item) => ({
    databaseId: item._id,
    label: item._id,
    body: item.body,
    id: item.nodecardId,
  }));
  /* 
  const retrievedLinks = links.map((item) => ({
    databaseId: item._id,
    edgeType: item.edgetype,
    id: item.linkId,
    source: item.source, //nodecard A
    target: item.target  //nodecard B
  }))
  */
  setupGraphRenderer(graphRenderer, deck);
  setupSwitchPanel(deck);
  setListener(deck, handler);
  setupNodecards(retrievedNodecards, deck);
  //TODO: setupLinks(retrievedLinks,deck);
};

function setupGraphRenderer(graphRenderer, deck) {
  const graphContainer = document.createElement("div");
  graphContainer.id = "graph-container";
  deck.container.append(graphContainer);
  const options = deck.renderingOptions;
  // No longer passing in data. Nodes must always be rendered one at a time in each Nodecard constructor call.
  deck.net = new graphRenderer.Network(graphContainer, {}, options);
  //TODO: deck.graphRenderer = new graphRendererFacade(vis);
}

function setListener(deck, handler) {
  deck.listener = (e) => handler(e, deck);
  deck.net.on("click", deck.listener);
}

function setupNodecards(data, deck) {
  data.map((node, i) => {
    // instantiates Nodecard
    const options = {
      id: node.id,
      pt: null,
      state: "fixed",
      mode: "inert",
      text: node.body,
      prelines: true,
    };
    setTimeout(() => deck.hydrateCard(options), i * 500);
  });
}

function setupLinks(data, deck) {
  data.map((edge, i) => {
    const options = {
      id: edge.id,
      source: edge.source,
      target: edge.target,
    };
    setTimeout(() => deck.hydrateLink(options), i * 500);
  });
}

async function createDatabaseEntry(card) {
  const data = await createNodecardDbEntry(card.id);
  card.databaseId = data.data[0]._key;
}

async function createDatabaseEntryForLink(link) {
  const data = await createLinkDbEntry();
  link.databaseId = data.data[0]._key;
}

// coordinates provided by options; id not provided.
Deck.prototype.createCard = function (options) {
  options.id = cuid();
  options.deck = this;
  const card = new Nodecard(options);
  card.setMode(); // render
  this.pushCard(card);
  if (this.settings.write && this.settings.save) {
    createDatabaseEntry(card);
  }
  return card;
};

// id provided by options; coordinates not provided.
Deck.prototype.hydrateCard = function (options) {
  options.deck = this;
  const card = new Nodecard(options);
  //card.setMode(); // rendering in inert mode is unnecessary when first loading the cards.
  this.pushCard(card);
};

Deck.prototype.createLink = function (options) {
  const link = buildLink(cardA, cardB, edgeType, this);
  link.addToDeck();
  const id = cuid();
  link.setId(id);
  link.render();
};

Deck.prototype.hydrateLink = function (options) {
  const link = buildLink(cardA, cardB, edgeType, this);
  link.addToDeck();
  link.render();
};

Deck.prototype.getCard = function (id) {
  let card = this.stack.find((x) => x.id === id);
  if (!card) console.error("the nodecard cannot be found!");
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
