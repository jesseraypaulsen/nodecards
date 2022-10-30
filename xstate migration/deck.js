import Nodecard from "./nodecard";
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
    data.cards.map(({ id, label, text }) => {
      this.send({ type: "CREATECARD", id, label, text });
    });
    data.links.map(({ id, label, from, to }) => {
      this.send({ type: "CREATELINK", id, label, from, to });
    });
    setTimeout(() => {
      this.send({ type: "INIT.COMPLETE" });
    }, 1000); // delay transition into mode.active, allowing physics engine to lay out the nodes before it's disabled.
  }

  createCard({ id, label }) {
    this.graphRenderer.body.data.nodes.add({ id, label });
    const card = new Nodecard(id, this);
    this.nodecards.push(card);
  }

  createLink({ id, label, to, from }) {
    this.graphRenderer.body.data.edges.add({ id, label, from, to });
    this.links.push({ id, label, from, to });
  }

  synchronizeSwitchPanelWithState(state) {
    //like "controlled components", their internal state is in sync with app state
    const selectElement = this.container.querySelector(".deck-modes");
    const toggleElement =
      this.container.querySelector(".physics").firstElementChild;

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

    console.log(state.changed)
    this.synchronizeSwitchPanelWithState(state);
    
    if (
      // child state, enabled by {sync: true} arg to spawn()
      state.event.type === "xstate.update" &&
      state.event.state.event.type === "xstate.init"
      ) {
        this.createCard(state.event.state.context);
      } else if (
      state.event.type === "xstate.update" &&
      state.event.state.event.type === "OPEN"
      ) {
        const card = this.nodecards.find(
          (card) => card.id === state.event.state.context.id
          );
          card.open(state.event.state);
        } else if (
          state.event.type === "xstate.update" &&
          state.event.state.value === "inert"
          ) {
            const card = this.nodecards.find(
        (card) => card.id === state.event.state.context.id
      );
      card.inertify(state.event.state);
    } 
    
    
    else if (state.event.type === "CREATELINK") {
      const { id, label, from, to } = state.event;
      this.createLink({ id, label, to, from });
    } else if (state.event.type === "PHYSICS.OFF") {
      const options = { physics: { enabled: false } };
      this.graphRenderer.setOptions(options);
    } else if (state.event.type === "PHYSICS.ON") {
      const options = { physics: { enabled: true } };
      this.graphRenderer.setOptions(options);
    } else if (state.event.type === "PERSIST.OFF") {
      console.log(`persistence off`);
    } else if (state.event.type === "PERSIST.ON") {
      console.log(`persistence on`);
    } else if (state.event.type === "DECK.READONLY") {
      console.log(`deck has switched to Read Only mode`);
    } else if (state.event.type === "DECK.MODIFIABLE") {
      console.log(`deck has switched to Modify mode`);
    } else if (state.event.type === "DECK.DISABLE") {
      console.log(`deck has switched to Disabled mode`);
    }

    if (state.event.type === "xstate.update") {
      console.log('xstate.update', state.event.state)
      if (state.event.state.matches('active')) {
        /* If we test state.event.state.value for 'read'/'edit', that doesn't tell me if the state has changed from 'read' to 'edit' or vice versa.
        So evaluating the event type is necessary, because we only want to renderState when there's a change. 
        state.changed doesn't seem to help because you can't do "state.value.changed" and active is a compound state. */
        if (state.event.state.event.type === "SWITCH.EDIT" || state.event.state.event.type === "SWITCH.READ") {
          const card = this.nodecards.find(
            (card) => card.id === state.event.state.context.id
            );
            card.renderState(state.event.state)
        }
      }

      if (state.event.state.event.type === "TYPING") {
        const card = this.nodecards.find(card => card.id === state.event.state.context.id)
        card.domElement.firstElementChild.value = state.event.state.event.text;
      }
    }
          
  }
}

/*TODO: 
 - cards should close when deck mode transitions to disabled. (DONE)
 
 - Physics should be turned on during initialization, and then turned off when it's complete. (DONE)
 
 - when the deck mode is active.readOnly the button should be disabled
 
 - https://xstate.js.org/docs/guides/states.html#state-changed     -> render function

 - remove card from state machine context in discard()

 - prevent second click on node causing duplicate nodecard elements
 */
