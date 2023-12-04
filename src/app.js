import { options } from "./options";
import * as vis from "vis-network";
import { interpret } from "xstate";
import { appMachine } from "./statecharts/app-machine";
import Render from "./render";
import DeckManager from "./views/deck-manager";
import nodecard from "./views/nodecard";
import { domAdapterFactory } from "./views/nodecard.dom-adapter";
import { settingsPanel, synchPanel } from "./views/settings-panel";
import promptViews from "./views/prompt";
import graphAdapterFactoryFactory from "./views/graph-adapter";
import peripheralControllers from "./controllers/peripheral-controllers";
import nodecardControllers from "./controllers/nodecard.controllers";
import { graphController } from "./controllers/graph.controllers";
import Wrappers from "./controllers/library-wrappers";
import { generateId, findEventType } from "./utils";
import "../assets/styles/main.css";
import "../assets/styles/settings-panel.css";
import "../assets/styles/nodecard.css";
import "../assets/styles/icon-button.scss";
import "../assets/styles/tooltip.scss";
import "../assets/styles/prompt.css";
import data from "../data/vervaeke.json";
import { guidedTour } from "./guided-tour";

const container = document.querySelector("#container");

// when App mode is off, prevent context menu from opening when you click and hold a node
container.addEventListener('contextmenu', (e) => e.preventDefault())

//TODO: import network API from within graph-adapter.js
const network = new vis.Network(container, {}, options);
const graphAdapterFactory = graphAdapterFactoryFactory(network);

const cardFace = nodecard(graphAdapterFactory, domAdapterFactory);

//TODO: createEdge, removeEdge, setPhysics should go in graph-adapter.js
const createEdge = (argsObject) => {
  network.body.data.edges.add(argsObject);
  return argsObject;
};
const removeEdge = (id) => {
  network.body.data.edges.remove(id);
};

const setPhysics = (value) => {
  const options = { physics: { enabled: value } };
  network.setOptions(options);
};

const { setupParentEffect, runChildEffect } = DeckManager(
  cardFace,
  createEdge,
  removeEdge
);
const service = interpret(appMachine(runChildEffect));

const { calculatePositionThenCreate, hydrateCard, hydrateLink, hydratePositionedCard, canvasToDOM } = Wrappers(network, service.send);

const { panelControllers, linkPromptController } = peripheralControllers(
  service.send
);

const openLinkPrompt = promptViews(linkPromptController);
const _graphController = graphController(service.send);
network.on("click", _graphController);

const sendPositions = (id, canvasPosition, domPosition) => {
  service.send({ 
    type: "setCardDOMPosition", 
    id, 
    domPosition });

  service.send({
    type: "setCardCanvasPosition",
    id,
    canvasPosition,
  });
};

const synchDOMWithGraph = () => {
  const canvasPositions = network.getPositions();
  const ids = Object.keys(canvasPositions);
  ids.forEach((id) => {
    const canvasPosition = canvasPositions[id];
    const domPosition = network.canvasToDOM(canvasPosition);

    sendPositions(id, canvasPosition, domPosition);
  });
};


const scaleActiveCards = (e) => {
  const rootStyle = document.querySelector(":root");
  rootStyle.style.setProperty("--zoom-scale", e.scale);
  document.querySelectorAll(".nodecard").forEach((el) => {
    el.style.transform = `scale(${e.scale})`;
  });
};

network.on("zoom", (e) => {
  synchDOMWithGraph();
  scaleActiveCards(e);
});

//TODO, not working
//https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
// visualViewport.onresize = e => {
//   synchDOMWithGraph()
//   console.log('synchDOMWithGraph called')
// }

network.on("resize", (e) => {
  setTimeout(() => synchDOMWithGraph(), 100);
});

network.on("dragging", (e) => {
  if (e.nodes[0]) {
    sendPositions(e.nodes[0], e.pointer.canvas, e.pointer.DOM);
  } else {
    // dragging view
    synchDOMWithGraph();
  }
});

network.on("stabilized", (e) => {
  synchDOMWithGraph();
});

network.on("doubleClick", (e) => {
  if (findEventType(e) === "background") {
    const id = generateId();
    const label = id;
    const text = "";
    const domPosition = e.pointer.DOM;
    calculatePositionThenCreate(id, label, text, domPosition);
  }
});

network.on('click', (e) => {
  console.log(e)
})

const peripheralEffects = {
  turnPhysicsOff: () => setPhysics(false),
  turnPhysicsOn: () => setPhysics(true),
  openLinkPrompt: (e) => openLinkPrompt(e),
};

settingsPanel(panelControllers);

const _nodecardControllers = nodecardControllers(container, service.send);

// highlight the card that the link originates from
const startHighlightingSourceCard = (id) => {
  const fromCard = Array.from(container.querySelectorAll(".nodecard")).find(el => el.dataset.id == id)
  fromCard.classList.add('linking-from')
}

// remove the highlight from the card that originated the link
const stopHighlightingSourceCard = (from) => {
  const fromCard = Array.from(container.querySelectorAll(".nodecard")).find(el => el.dataset.id == from)
  if (fromCard && fromCard.classList.contains('linking-from')) fromCard.classList.remove('linking-from')
}


const runParentEffect = setupParentEffect({
  controllers: _nodecardControllers,
  startHighlightingSourceCard,
  stopHighlightingSourceCard
});

const { init, render } = Render(
  runParentEffect,
  synchPanel,
  hydrateCard,
  hydrateLink,
  peripheralEffects,
  hydratePositionedCard
);

// alias
const createPositionedCard = hydratePositionedCard;

// subscribe views
service.onTransition((state, event) => {
  console.log(state)
  if (state.event.type === "xstate.init") init(data);
  else render(state, event);
});

service.start();

guidedTour(service.send, createPositionedCard, canvasToDOM)
