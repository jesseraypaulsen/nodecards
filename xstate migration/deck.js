export default class Deck {
  constructor(graphRenderer) {
    this.graphRenderer = graphRenderer;
    this.nodecards = []
  }

  createCard({id,label,text}) {
    console.log(`Deck.createCard called`)
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

  render(state) {
    // child state, enabled by {sync: true} arg to spawn()
    if (state.event.type === "xstate.update" && state.event.state.event.type === "xstate.init") {
      this.createCard(state.event.state.context)
    }
    if (state.event.type === "xstate.update" && state.event.state.event.type === "OPEN") {
      const card = this.nodecards.filter(card => card.id === state.event.state.context.id)[0]
      card.open()
    }
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