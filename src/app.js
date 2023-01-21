import { options } from "./options";
import * as vis from "vis-network";
import { interpret } from "xstate";
import { appMachine } from "./statecharts/app-machine";
import Render from "./render";
import DeckManager from "./views/deck-manager";
import nodecard from "./views/nodecard";
import { domAdapterFactory } from "./views/nodecard.dom-adapter";
import { settingsPanel, synchPanel } from "./views/settings-panel";
import promptView from "./views/prompt";
import graphAdapterFactoryFactory from "./views/graph-adapter";
import peripheralControllers from "./controllers/peripheral-controllers";
import nodecardControllers from "./controllers/nodecard.controllers";
import { graphController } from "./controllers/graph.controllers";
import Wrappers from "./controllers/library-wrappers";
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

const setPhysics = (value) => {
  const options = { physics: { enabled: value } };
  network.setOptions(options);
};

const { setupParentEffect, runChildEffect } = DeckManager(cardFace, createEdge);
const service = interpret(appMachine(runChildEffect));
const wrappers = Wrappers(network, service.send);
const {
  calculatePositionThenCreate,
  setPositionAfterCreation,
  hydrateCard,
  hydrateLink,
} = wrappers;
const { panelControllers, promptController } = peripheralControllers(
  service.send,
  calculatePositionThenCreate
);

const { openPrompt, closePrompt } = promptView(promptController);
const _graphController = graphController(service.send);
network.on("click", _graphController);
network.on("resize", (e) => console.log("resize: ", e));
network.on("dragEnd", (e) => console.log("dragEnd: ", e));
network.on("hold", (e) => console.log("hold: ", e));
network.on("stabilized", (e) => console.log("stabilized: ", e));

const peripheralEffects = {
  turnPhysicsOff: () => setPhysics(false),
  turnPhysicsOn: () => setPhysics(true),
  openPrompt: (eventData) => openPrompt(eventData),
  closePrompt: () => closePrompt(),
};

settingsPanel(panelControllers);
const _nodecardControllers = nodecardControllers(container, service.send);

const catchActiveCardEvent = (id) => {
  const domCards = Array.from(container.querySelectorAll(".nodecard")).filter(
    (el) => el.dataset.id !== id
  );
  const handler = (e) => {
    service.send({
      type: "createLinkIfLinkCreationIsOn",
      to: e.target.dataset.id,
    });
    domCards.forEach((el) => {
      el.removeEventListener("click", handler);
    });
  };
  domCards.forEach((el) => {
    el.addEventListener("click", handler);
  });
};

const runParentEffect = setupParentEffect({
  controllers: _nodecardControllers,
  setPositionAfterCreation,
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
  console.log(event);
  if (state.event.type === "xstate.init") init(data);
  else render(state, event);
});

service.start();
