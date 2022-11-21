import { options } from "./options";
import * as vis from "vis-network";
import { interpret } from 'xstate';
import { appMachine } from "./statecharts/app-machine"
import App from './app'
import nodecardViews from './views/nodecard'
import { setupSwitchPanel } from "./views/switch-panel";
import { domControllers } from "./controllers/dom.controllers";
import { graphController } from "./controllers/graph.controllers";
import "../assets/styles/main.css";
import "../assets/styles/switch-panel.css";
import "../assets/styles/nodecard.css";
import "../assets/styles/icon-button.scss";
import "../assets/styles/tooltip.scss";
import "../assets/styles/prompt.css"


const container = document.querySelector("#container");
const network = new vis.Network(container, {}, options);

const service = interpret(appMachine);

const gc = graphController(service.send)
const dc = domControllers(service.send)

setupSwitchPanel(dc.panel)
network.on("click", gc)

const nv = nodecardViews(network, dc);

const app = App(nv, service.send)


const data = { 
  cards: [
    { id:"one", label: "1", text: "the first card"},
    { id:"two", label: "2", text: "the second card"},
    { id:"three", label: "3", text: "the third card"}
  ],
  links: [
    { id: "a", label: "a", from: "one", to: "two" },
    { id: "b", label: "b", from: "two", to: "three" },
    { id: "c", label: "c", from: "three", to: "one" }
  ]
};


// subscribe views
service.onTransition((state) => {
  //console.log(state.changed)
  if (state.event.type === "xstate.init") app.init(data)
  else app.render(state)
});

service.start();