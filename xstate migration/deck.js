export default class Deck {
  constructor(graphRenderer, send) {
    this.graphRenderer = graphRenderer;
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
    // TODO: create dom element
    this.nodecards.push({
      id,
      label,
      text,
      open: () => { 
        console.log(`card ${id} opened for reading and writing!`) 
      }
    })
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
      card.open()
    }
    console.log(state)
  }
}

class Nodecard {
  constructor({id,label,text}) {
    this.id = id;
    // TODO: create dom element
  }
  
  inert(cardState) {
    this.renderNode(id,label) // 'this' should point to the deck instance?
  }

  read(cardState) {}

  edit(cardState) {}
}

class Link {}