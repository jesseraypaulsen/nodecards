import Deck from "./deck";
import { options } from "./options";
import nonlinearHandler from "./nonlinear-handler";
import * as vis from "vis-network";
import "./styles/main.css";
import "./styles/switch-panel.css";
import "./styles/nodecard.css";
import "./styles/icon-button.scss";
import "./styles/tooltip.scss";

const container = document.querySelector("#container");

Deck.initialize(container, options, nonlinearHandler, vis);
