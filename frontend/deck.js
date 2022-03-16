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
  // No longer passing in data. Nodes must always be rendered one at a time in each Nodecard constructor call.
  deck.net = new graphRenderer.Network(graphContainer, {}, options);
  //TODO: deck.graphRenderer = new graphRendererFacade(vis);
}

function setListener(deck, handler) {
  deck.listener = (e) => handler(e, deck);
  deck.net.on("click", deck.listener);
}

async function setupNodecards(deck, callback) {
  const data = await getDbCollection("nodecards");
  data.map((item, i) => {
    const options = {
      id: item.nodecardId,
      text: item.body,
      databaseId: item._id,
      databaseKey: item._key,
      pt: null,
      state: "fixed",
      mode: "inert",
      prelines: true,
    };
    setTimeout(() => {
      deck.hydrateCard(options);
      if (i === data.length - 1) {
        callback(deck);
      }
    }, i * 200);
  });
}

async function setupLinks(deck) {
  const data = await getDbCollection("links");
  data.map((item, i) => {
    const options = {
      databaseId: item._id,
      source: item._from, // _from and _to must be document handles i.e. _id
      target: item._to,
      edgetype: item.edgetype,
      id: item.linkId,
    };
    deck.hydrateLink(options);
    //setTimeout(() => deck.hydrateLink(options), i * 300);
  });
}

// coordinates provided by options; id not provided.
Deck.prototype.createCard = async function (options) {
  options.id = cuid();
  options.deck = this;
  const card = new Nodecard(options);
  card.setMode(); // render
  this.pushCard(card);
  if (this.settings.write && this.settings.save) {
    await createDatabaseEntry(card);
  }
  return card;
};
async function createDatabaseEntry(card) {
  const data = await createNodecardDbEntry(card.id);
  card.databaseKey = data.data[0]._key;
  card.databaseId = data.data[0]._id;
}

async function createDatabaseEntryForLink(link) {
  const data = await createLinkDbEntry(link);
  console.log(`from createDatabaseEntryForLink, here's data`);
  console.log(data);
  link.setDatabaseId(data.data[0]._id);
}

// id provided by options; coordinates not provided.
Deck.prototype.hydrateCard = function (options) {
  options.deck = this;
  const card = new Nodecard(options);
  //card.setMode(); // rendering in inert mode is unnecessary when first loading the cards.
  this.pushCard(card);
};

Deck.prototype.createLink = function (options) {
  options.deck = this;
  const link = buildLink(options);
  const id = cuid(); //create new id
  link.setId(id);

  //we need the _id of each vertex in the database before we can create the new edge doc.
  const source = this.getCard(options.sourceId);
  const target = this.getCard(options.targetId);
  link.setSourceDatabaseId(source.databaseId);
  console.log(
    `from createLink, here's target ${target} and here's target.databaseId: ${target.databaseId}`
  ); //returns null
  link.setTargetDatabaseId(target.databaseId);

  link.addToDeck();
  link.render();
  if (this.settings.save) createDatabaseEntryForLink(link);
};

Deck.prototype.hydrateLink = function ({
  databaseId,
  source,
  target,
  edgetype,
  id,
}) {
  // for rendering in vis-network
  const sourceId = this.getCardIdByDatabaseId(source);
  const targetId = this.getCardIdByDatabaseId(target);

  const options = { sourceId, targetId, edgetype, deck: this };

  const link = buildLink(options);

  link.setId(id);
  link.setDatabaseId(databaseId);
  link.setSourceDatabaseId(source);
  link.setTargetDatabaseId(target);
  link.addToDeck();
  link.render();
};

Deck.prototype.getCard = function (id) {
  let card = this.stack.find((x) => x.id === id);
  if (!card)
    console.error(`the nodecard with id of ${id} cannot be found in the deck.`);
  return card;
};

Deck.prototype.getCardIdByDatabaseId = function (databaseId) {
  let card = this.stack.find((x) => x.databaseId === databaseId);
  if (!card)
    console.error(
      `the nodecard with databaseId of ${databaseId} cannot be found in the deck.`
    );
  return card.id;
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
