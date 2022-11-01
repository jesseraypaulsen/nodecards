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

  promptToCreate(event) {
    const { x, y } = event.data.pointer.DOM;
    const prompt = document.createElement("div");
    prompt.innerHTML = `<span>x</span><span>Create Card</span>`
    prompt.classList.add("creation-prompt");
    this.container.append(prompt); //append must occur before setPosition
    this.setPosition(prompt, x, y)
    prompt.firstElementChild.addEventListener('click', () => this.send('CLOSE.PROMPT'))
  }

  closePrompt() {
    const prompt = document.querySelector(".creation-prompt");
    if (prompt) prompt.remove();
  }

  setPosition(element, x, y) {
    let width = parseInt(
      getComputedStyle(element).width.substring(0, 3)
    );
    let height = parseInt(
      getComputedStyle(element).height.substring(0, 3)
    );
    element.style.left = x - width / 2 + "px";
    element.style.top = y - height / 2 + "px";
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
        state.changed doesn't seem to help because "state.value.changed" is invalid, and active is a compound state. */

      if (childEvent.type === "TYPING") card.updateEditor(childEvent); // controlled element

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

    if (eventType === "openPrompt") {
      this.promptToCreate(state.event)
    }
    if (eventType === "closePrompt") {
      this.closePrompt()
    }
  }
  

  render(state) {
    // child state updates enabled by {sync: true} arg to spawn()
    if (state.event.type === "xstate.update") this.renderNodecard(state);
    else this.renderDeck(state);
  }

  /* Finds the center point of an element relative to its offsetParent property. 
    Useful for corroborating setPosition values.
    DO NOT DELETE, even if it's not currently being used!! */
    centerpoint(element) {
    let centerX = element.offsetLeft + element.offsetWidth / 2;
    let centerY = element.offsetTop + element.offsetHeight / 2;
    console.log(`centerX: ${centerX} / centerY: ${centerY}`);
    // output should be equal to click event coordinates
  }
}

/*TODO: 
 - cards should close when deck mode transitions to disabled. (DONE)
 
 - Physics should be turned on during initialization, and then turned off when it's complete. (DONE)
 
 - remove card from state machine context on DELETE event (DONE, but partially unresolved)
   (How to remove the spawned machine from the parent's children property? Maybe it's unnecessary?
    The question remains unanswered: https://stackoverflow.com/q/61013927 )

 - delete button (DONE)

 - when the deck mode is "active.readOnly" the button should be disabled
 
 - fix: prevent second click on node causing duplicate nodecard elements

 - fix: when deck is in mode.modify, and card is in active.edit, if deck is switched to mode.read then card is still in active.edit

 - drag button

 - webSource button

 - user creation of new cards and links

 - popup prompt for creating cards, along with a corresponding state

 - (maybe) try to make method names correspond to state values to obviate the jungle of conditionals in deck.render, 
  eg read,edit,inert => card[state.value] 
  
*/
