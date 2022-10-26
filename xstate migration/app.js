import { options } from "../options";
import * as vis from "vis-network";
import { typeofSelection } from "../utils";
import { interpret } from 'xstate';
import { deckMachine } from "./statecharts"
import Deck from './deck'

const container = document.querySelector("#container");

const network = new vis.Network(container, {}, options);

const service = interpret(deckMachine);

const handler = (e) => {
  const eventType = typeofSelection(e)
  console.log(`handler: ${e.nodes[0]}`)
  if (eventType === "NC") service.send({ type: "CARD.CLICK", id: e.nodes[0] })
}

network.on("click", handler)

const data = [
  { id:"one", label: "1", text: "the first card"},
  { id:"two", label: "2", text: "the second card"},
  { id:"three", label: "3", text: "the third card"}
];

const deck = new Deck(network, service.send)

service.onTransition((state) => {
  if (state.event.type === "xstate.init") deck.init(data)
  else deck.render(state)
});

service.start();