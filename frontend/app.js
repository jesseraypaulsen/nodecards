import Deck from "./deck";
import { options } from "./options";
import nonlinearHandler from "./nonlinear-handler";
import * as vis from "vis-network";
import "./styles/styles.css";

const container = document.querySelector("#container");

Deck.initialize(container, options, nonlinearHandler, vis);
