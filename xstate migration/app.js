import { options } from "../options";
import * as vis from "vis-network";
import { typeofSelection } from "../utils";
import { interpret } from 'xstate';
import { deckMachine } from "./statecharts"

const container = document.querySelector("#container");

const network = new vis.Network(container, {}, options);

const data = [
  { id:"1", label: "1", text: "the first card"},
  { id:"2", label: "2", text: "the second card"},
  { id:"3", label: "3", text: "the third card"}
];

const nodecards = [];

function createCard({id,label,text}) {
  console.log(`createCard!`)
  network.body.data.nodes.add({ id, label });
  // TODO: create dom element
  nodecards.push({
    id,
    label,
    text,
    open: () => { 
      console.log(`card ${id} opened for reading and writing!`) 
    }
  })
  
  return {
    id,
    label,
    text
  }
}

const machine = deckMachine(createCard);

const service = interpret(machine).onTransition((state) => {
  console.log(state.value, state.context);
});

service.start();

const handler = (e) => {
  const eventType = typeofSelection(e)
  console.log(`handler: ${e.nodes[0]}`)
  if (eventType === "NC") service.send({ type: "CARD.CLICK", id: e.nodes[0] })
}

network.on("click", handler)

(function(data) {
  data.map(({id,label,text}) => {
    service.send({type:"CREATECARD", id, label, text})
  })
  service.send({type:"INIT.COMPLETE"})
}(data))