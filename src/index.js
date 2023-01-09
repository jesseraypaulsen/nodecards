import { options } from "./options";
import * as vis from "vis-network";
import { interpret } from "xstate";
import { appMachine } from "./statecharts/app-machine";
import App from "./app";
import nodecard from "./views/nodecard";
import { domAdapterFactoryFactory } from "./views/nodecard.dom-adapter";
import activeTemplates from "./views/active-templates";
import createButtonBar from "./views/button-bar";
import { settingsPanel, synchPanel } from "./views/settings-panel";
import promptView from "./views/prompt";
import graphAdapterFactoryFactory from "./views/graph-adapter";
import { domControllers } from "./controllers/dom.controllers";
import { graphController } from "./controllers/graph.controllers";
import "../assets/styles/main.css";
import "../assets/styles/settings-panel.css";
import "../assets/styles/nodecard.css";
import "../assets/styles/icon-button.scss";
import "../assets/styles/tooltip.scss";
import "../assets/styles/prompt.css";

const container = document.querySelector("#container");
const network = new vis.Network(container, {}, options);

const service = interpret(appMachine);
const {
  editorController,
  buttonsControllers,
  panelControllers,
  promptController,
} = domControllers(service.send);

const activeTemplatesWithController = activeTemplates(editorController);
const buttonTemplatesWithControllers = createButtonBar(buttonsControllers);
const settingsPanelWithControllers = settingsPanel(panelControllers);
const promptWithController = promptView(promptController);

network.on("click", graphController(service.send));

const graphAdapterFactory = graphAdapterFactoryFactory(network);
const domAdapterFactory = domAdapterFactoryFactory(
  activeTemplatesWithController,
  buttonTemplatesWithControllers
);
const cardFace = nodecard(graphAdapterFactory, domAdapterFactory);

//const { setPhysics, createEdge } = graphFace;
const createEdge = (id, label, from, to) => {
  network.body.data.edges.add({ id, label, from, to });
};
const setPhysics = (value) => {
  const options = { physics: { enabled: value } };
  network.setOptions(options);
};

const app = App(
  cardFace,
  settingsPanelWithControllers,
  promptWithController,
  synchPanel,
  setPhysics,
  createEdge
);

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
service.onTransition((state) => {
  if (state.event.type === "xstate.init") app.init(data, service.send, network);
  else app.render(state, service.send, network);
});

service.start();
