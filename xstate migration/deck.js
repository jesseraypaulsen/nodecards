import Nodecard from "./nodecard"
import { deckMachine } from "./statecharts";

export default class Deck {
  constructor(graphRenderer, container, send) {
    this.graphRenderer = graphRenderer;
    this.container = container;
    this.send = send;
    this.nodecards = [];
    this.links = [];
  }
  
  init(data) {
    data.cards.map(({id,label,text}) => {
      this.send({type:"CREATECARD", id, label, text })
    })
    data.links.map(({id,label,from,to}) => {
      this.send({type:"CREATELINK", id, label, from, to })
    })
    setTimeout(() => {
      this.send({type:"INIT.COMPLETE"})
    },1000) // delay transition into mode.active, allowing physics engine to lay out the nodes before it's disabled.
           
  }

  createCard({id,label,text}) {
    this.graphRenderer.body.data.nodes.add({ id, label });
    const card = new Nodecard(id,label,text,this)
    this.nodecards.push(card)
  }

  createLink({id,label,to,from}) {
    this.graphRenderer.body.data.edges.add({id,label,from,to})
    this.links.push({id,label,from,to})
  }

  synchronizeSwitchPanelWithState(state) {

    //these should probably be "controlled components", so that their internal state is in sync with app state.
    const selectElement = this.container.querySelector(".deck-modes")
    const toggleElement = this.container.querySelector(".physics").firstElementChild;

    if (state.event.type === "PHYSICS.OFF" && !state.event.sentByUser) {
      //not sent by user! change toggler to reflect the state!
      toggleElement.checked = false;
    }
    if (state.event.type === "DECK.DISABLE" && !state.event.sentByUser) {
      //not sent by user! change value of select element to reflect the state!
      selectElement.value = "DECK.DISABLE";
    }
  }
  
  render(state) {
    this.synchronizeSwitchPanelWithState(state)

    if (state.event.type === "xstate.update" && state.event.state.event.type === "xstate.init") {
      // child state, enabled by {sync: true} arg to spawn()
      this.createCard(state.event.state.context)
    } 
    else if (state.event.type === "xstate.update" && state.event.state.event.type === "OPEN") {
      const card = this.nodecards.find(card => card.id === state.event.state.context.id)
      card.open(state.event.state.value)
    }
    else if (state.event.type === "xstate.update" && state.event.state.value === "inert") {
      const card = this.nodecards.find(card => card.id === state.event.state.context.id)
      card.inertify()
    }
    else if (state.event.type === "xstate.update" && state.event.state.value.active === "edit") {
      const card = this.nodecards.find(card => card.id === state.event.state.context.id)
      //card.edit()
      console.log('card switched to edit mode')
    }
    else if (state.event.type === "CREATELINK") {
      const {id,label,from,to} = state.event;
      this.createLink({id,label,to,from});
    }
    else if (state.event.type === "PHYSICS.OFF") {
      const options = { physics: { enabled: false }}
      this.graphRenderer.setOptions(options);
    }
    else if (state.event.type === "PHYSICS.ON") {
      const options = { physics: { enabled: true }}
      this.graphRenderer.setOptions(options);
    }
    else if (state.event.type === "PERSIST.OFF") {
      console.log(`persistence off`)
    }
    else if (state.event.type === "PERSIST.ON") {
      console.log(`persistence on`)
    }
    else if (state.event.type === "DECK.READONLY") {
      // "DECK.READONLY": { target: 'mode.active.readOnly' }
      console.log(`deck has switched to Read Only mode`)
    }
    else if (state.event.type === "DECK.MODIFIABLE") {
      console.log(`deck has switched to Modify mode`)
      // "DECK.MODIFIABLE": { target: 'mode.active.modifiable' }
    }
    else if (state.event.type === "DECK.DISABLE") {
      console.log(`deck has switched to Disabled mode`)
      // "DECK.DISABLE": { target: 'mode.disabled' }
    }
  }
}

/*TODO: 
 - cards should close when deck mode transitions to disabled. (DONE)
 
 - Physics should be turned on during initialization, and then turned off when it's complete. (DONE)
 
 - when the deck mode is active.readOnly the button should be disabled
 
 - https://xstate.js.org/docs/guides/states.html#state-changed     -> render function
 */