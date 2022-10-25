import { options } from "../options";
import * as vis from "vis-network";
import { typeofSelection } from "../utils";
import { interpret } from 'xstate';
import { deckMachine } from "./statecharts"

const nodecards = [];

const container = document.querySelector("#container");

const network = new vis.Network(container, {}, options);

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
}

const machine = deckMachine(createCard);

const service = interpret(machine).onTransition((state) => {
  /*console.log('state.event', state.event)
  console.log('state.value', state.value)
  console.log('state.context', state.context)
  console.log('state.children', state.children)*/
  
  // child state, enabled by {sync: true} arg to spawn()
  if (state.event.type === "xstate.update" && state.event.state.event.type === "xstate.init") {
    //console.log(state.event.state.value)
    //console.log(state.children[state.event.id])
    //console.log(state.event.state.context)
    console.log(state.event.state)
    createCard(state.event.state.context)
  }
  // TODO: deck.render(state)
});

service.start();


(function(data) {
  data.map(({id,label,text}) => {
    service.send({type:"CREATECARD", id, label, text})
  })
  service.send({type:"INIT.COMPLETE"})
}(data))

//TODO: redirect current functionality via Deck