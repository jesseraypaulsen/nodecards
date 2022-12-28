import { options } from "./options";
import * as vis from "vis-network";
import { interpret } from "xstate";
import { appMachine } from "./statecharts/app-machine";
import App from "./app";
import nodecard from "./views/nodecard";
import { domFaceFactory } from "./views/nodecard.dom";
import activeTemplates from "./views/active-templates";
import createButtonBar from "./views/button-bar";
import { settingsPanel, synchPanel } from "./views/settings-panel";
import promptView from "./views/prompt";
import graphFaceFactory from "./views/graph";
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

network.on("click", graphController(service.send));

const domFace = domFaceFactory();
const graphFace = graphFaceFactory(network);
const cardFace = nodecard(graphFace, domFace);

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

const { setPhysics, createEdge } = graphFace;

const app = App(
  cardFace,
  activeTemplatesWithController,
  buttonTemplatesWithControllers,
  settingsPanelWithControllers,
  promptWithController,
  synchPanel,
  setPhysics,
  createEdge,
  service.send,
  network
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
  //console.log(state.changed)
  if (state.event.type === "xstate.init") app.init(data);
  else app.render(state);
});

service.start();
