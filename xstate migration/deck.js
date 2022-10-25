class Deck {
  constructor(graphRenderer, container, options) {
    /*this.machine = interpret(deckMachine(this)).onTransition((state) => {
      console.log(state.value, state.context);
    });*/
    this.graphRenderer = new graphRenderer(container, {}, options);
    this.cards = []
  }

  createCard(data) {
    this.cards.push(new Nodecard(data))
  }

  renderNode(id,label) {
    this.graphRenderer.body.data.nodes.add({ id, label }); 
  }

  render(state) {
    // this will execute when the state changes
    console.log(state.value, state.context);
    /* 
      state.context.cards.map(card => {
        Nodecard[card.ref]
      })
    */
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