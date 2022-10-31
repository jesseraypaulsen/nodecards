import Nodecard from "./nodecard";

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
    //like "controlled components", their internal state should be in sync with app state
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

  renderNodecard(state) {
    const childState = state.event.state;
    const childEvent = state.event.state.event;

    if (childEvent.type === "xstate.init") this.createCard(childState.context);
    else {
      const card = this.nodecards.find(
        (card) => card.id === childState.context.id
      );

      if (childEvent.type === "OPEN") card.open(childState);

      if (childState.value === "inert") card.inertify(childState);

      if (
        childEvent.type === "SWITCH.EDIT" ||
        childEvent.type === "SWITCH.READ"
      )
        card.renderState(childState);
      /* If we test state.event.state.value for 'read'/'edit', that doesn't tell me if the state has changed from 'read' to 'edit' or vice versa.
        So evaluating the event type is necessary, because we only want to renderState when there's a change. 
        state.changed doesn't seem to help because you can't do "state.value.changed" and active is a compound state. */

      if (childEvent.type === "TYPING") card.updateEditor(childEvent);

      if (childEvent.type === "DELETE") card.discard();
    }
  }

  renderDeck(state) {
    const eventType = state.event.type;
    this.synchronizeSwitchPanelWithState(state);
    if (eventType === "CREATELINK") {
      const { id, label, from, to } = state.event;
      this.createLink({ id, label, to, from });
    } else if (eventType === "PHYSICS.OFF") {
      const options = { physics: { enabled: false } };
      this.graphRenderer.setOptions(options);
    } else if (eventType === "PHYSICS.ON") {
      const options = { physics: { enabled: true } };
      this.graphRenderer.setOptions(options);
    } else if (eventType === "PERSIST.OFF") {
      console.log(`persistence off`);
    } else if (eventType === "PERSIST.ON") {
      console.log(`persistence on`);
    } else if (eventType === "DECK.READONLY") {
      console.log(`deck has switched to Read Only mode`);
    } else if (eventType === "DECK.MODIFIABLE") {
      console.log(`deck has switched to Modify mode`);
    } else if (eventType === "DECK.DISABLE") {
      console.log(`deck has switched to Disabled mode`);
    }
  }

  render(state) {
    // child state updates enabled by {sync: true} arg to spawn()
    if (state.event.type === "xstate.update") this.renderNodecard(state);
    else this.renderDeck(state);
  }
}

/*TODO: 
 - cards should close when deck mode transitions to disabled. (DONE)
 
 - Physics should be turned on during initialization, and then turned off when it's complete. (DONE)
 
 - when the deck mode is "active.readOnly" the button should be disabled
 
 - remove card from state machine context on DELETE event -> study TodoMVC to understand how it deletes child machines
 https://codesandbox.io/s/xstate-todomvc-33wr94qv1

 - prevent second click on node causing duplicate nodecard elements

 - fix: when deck is in mode.modify, and card is in active.edit, if deck is switched to mode.read then card is still in active.edit

 - drag button

 - delete button

 - webSource button

 - user creation of new cards and links
 */
