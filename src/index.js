import { options } from "./options";
import * as vis from "vis-network";
import { interpret } from "xstate";
import { appMachine } from "./statecharts/app-machine";
import App from "./app";
import DeckManager from "./views/deck-manager";
import nodecard from "./views/nodecard";
import { domAdapterFactory } from "./views/nodecard.dom-adapter";
import { settingsPanel, synchPanel } from "./views/settings-panel";
import promptView from "./views/prompt";
import graphAdapterFactoryFactory from "./views/graph-adapter";
import pControllers from "./controllers/p-controllers";
import { graphController } from "./controllers/graph.controllers";
import Wrappers from "./library-wrappers";
import drag from "./views/drag";
import "../assets/styles/main.css";
import "../assets/styles/settings-panel.css";
import "../assets/styles/nodecard.css";
import "../assets/styles/icon-button.scss";
import "../assets/styles/tooltip.scss";
import "../assets/styles/prompt.css";

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

const { runParentEffect, runChildEffect } = DeckManager(
  cardFace,
  createEdge,
  drag(container)
);
const service = interpret(appMachine(runChildEffect));
const wrappers = Wrappers(network, service.send);
const { calculatePositionThenCreate } = wrappers;
const { panelControllers, promptController } = pControllers(
  service.send,
  calculatePositionThenCreate
);

const { openPrompt, closePrompt } = promptView(promptController);

network.on("click", graphController(service.send));
network.on("resize", (e) => console.log("resize: ", e));
network.on("dragEnd", (e) => console.log("dragEnd: ", e));
network.on("hold", (e) => console.log("hold: ", e));

const peripheralEffects = {
  turnPhysicsOff: () => setPhysics(false),
  turnPhysicsOn: () => setPhysics(true),
  openPrompt: (eventData) => openPrompt(eventData),
  closePrompt: () => closePrompt(),
};

settingsPanel(panelControllers);

const app = App(runParentEffect, synchPanel, wrappers, peripheralEffects);

const data = {
  cards: [
    { id: "one", label: "1", text: "the first card" },
    { id: "two", label: "2", text: "the second card" },
    {
      id: "three",
      label: "3",
      text: "the third card",
      position: { x: -350, y: -300 },
    },
  ],
  links: [
    { id: "a", label: "a", from: "one", to: "two" },
    { id: "b", label: "b", from: "two", to: "three" },
    { id: "c", label: "c", from: "three", to: "one" },
  ],
};

// subscribe views
service.onTransition((state, event) => {
  if (state.event.type === "xstate.init") app.init(data);
  else app.render(state, event, service.send);
});

service.start();
