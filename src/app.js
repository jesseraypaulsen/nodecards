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
import data from "../data/abc123.json";

const container = document.querySelector("#container");
const network = new vis.Network(container, {}, options);
const graphAdapterFactory = graphAdapterFactoryFactory(network);

const cardFace = nodecard(graphAdapterFactory, domAdapterFactory);
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
const wrappers = Wrappers(network, service.send);
const { calculatePositionThenCreate, hydrateCard, hydrateLink } = wrappers;
const { panelControllers, linkPromptController } = peripheralControllers(
  service.send
);

const openLinkPrompt = promptViews(linkPromptController);
const _graphController = graphController(service.send);
network.on("click", _graphController);

const sendPositions = (id, canvasPosition, domPosition) => {
  service.send({ type: "setCardDOMPosition", id, domPosition });
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

network.on("resize", (e) => {
  setTimeout(() => synchDOMWithGraph(), 100);
});

network.on("dragging", (e) => {
  if (e.nodes[0]) {
    // dragging node
    // service.send({
    //   type: "setCardDOMPosition",
    //   id: e.nodes[0],
    //   domPosition: e.pointer.DOM,
    // });
    // service.send({
    //   type: "setCardCanvasPosition",
    //   id: e.nodes[0],
    //   canvasPosition: e.pointer.canvas,
    // });
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

const peripheralEffects = {
  turnPhysicsOff: () => setPhysics(false),
  turnPhysicsOn: () => setPhysics(true),
  openLinkPrompt: (e) => openLinkPrompt(e),
};

settingsPanel(panelControllers);
const _nodecardControllers = nodecardControllers(container, service.send);

const catchActiveCardEvent = (id) => {
  const domCards = Array.from(container.querySelectorAll(".nodecard")).filter(
    (el) => el.dataset.id !== id
  );
  const handler = (e, id) => {
    service.send({
      type: "createLinkIfLinkCreationIsOn",
      to: id,
    });
    domCards.forEach((el) => {
      el.removeEventListener("click", handler);
    });
  };
  domCards.forEach((el) => {
    const id = el.dataset.id;
    el.addEventListener("click", (e) => handler(e, id));
  });
};

const runParentEffect = setupParentEffect({
  controllers: _nodecardControllers,
  catchActiveCardEvent,
});

const { init, render } = Render(
  runParentEffect,
  synchPanel,
  hydrateCard,
  hydrateLink,
  peripheralEffects
);

// subscribe views
service.onTransition((state, event) => {
  if (state.event.type === "xstate.init") init(data);
  else render(state, event);
});

service.start();
