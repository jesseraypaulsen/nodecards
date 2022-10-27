import Nodecard from "./nodecard"

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
    this.send({type:"INIT.COMPLETE"})
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
  
  render(state) {
    if (state.event.type === "xstate.update" && state.event.state.event.type === "xstate.init") {
      // child state, enabled by {sync: true} arg to spawn()
      this.createCard(state.event.state.context)
    } 
    else if (state.event.type === "CREATELINK") {
      const {id,label,from,to} = state.event;
      this.createLink({id,label,to,from});
    }
    else if (state.event.type === "xstate.update" && state.event.state.event.type === "OPEN") {
      const card = this.nodecards.find(card => card.id === state.event.state.context.id)
      console.log('card', card)
      console.log(state.event.state.value)
      card.open(state.event.state.value)
    }
    else if (state.event.type === "xstate.update" && state.event.state.event.type === "INERTIFY") {
      const card = this.nodecards.find(card => card.id === state.event.state.context.id)
      card.inertify()
    }
    console.log(state)
  }
}

