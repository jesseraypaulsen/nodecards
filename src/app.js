import Nodecard from "./nodecard";
import { qs, render, setPosition, openPrompt, closePrompt, synchPanel } from './views/dom';
import { graphController } from './controllers/graph.controllers';
import { domControllers } from "./controllers/dom.controllers";

export default class App {
  constructor(graphRenderer, container, send, controllers) {
    this.graphRenderer = graphRenderer;
    this.container = container;
    this.send = send;
    this.nodecards = [];
    this.links = [];
    this.decks = [];
    this.controllers = controllers;
  }

  // TODO: 'invoke' in XState
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

  // the only method exclusive to the graph renderer
  setPhysics(value) {
    const options = { physics: { enabled: value } };
    this.graphRenderer.setOptions(options);
  }

  createCard({ id, label }) {
    this.graphRenderer.body.data.nodes.add({ id, label });
    const card = new Nodecard(this);
    this.nodecards.push(card);
  }
  
  createLink({ id, label, to, from }) {
    this.graphRenderer.body.data.edges.add({ id, label, from, to });
    this.links.push({ id, label, from, to });
  }

  // DOM methods
  
  renderNodecard(childState) {
    const childEvent = childState.event;
    const { id, label, text } = childState.context;

    if (childEvent.type === "xstate.init") this.createCard(childState.context);
    else {
      // const card = this.nodecards.find(
      //   (card) => card.id === id
      // );
      const card = this.nodecards[0];
      if (childEvent.type === "cardActivated") {
        const { x, y } = childEvent;
        const nestedState = childState.value.active;
        card.open({ id, x, y, nestedState, text })
      }

      if (childState.value === "inert") card.inertify(label, id);

      if (
        childEvent.type === "SWITCH.EDIT" ||
        childEvent.type === "SWITCH.READ"
      ) {
        const nestedState = childState.value.active;
        //const text = childState.context.text;
        card.renderState(nestedState, text, id);
        /* If we test state.event.state.value for 'read'/'edit', that doesn't tell me if the state has changed from 'read' to 'edit' or vice versa.
          So evaluating the event type is necessary, because we only want to renderState when there's a change. 
          state.changed doesn't seem to help because "state.value.changed" is invalid, and active is a compound state. */
      }

      if (childEvent.type === "TYPING") card.updateEditor(childEvent.text, id); // controlled element

      if (childEvent.type === "DELETE") card.discard(id);
    }
  }

  render(state) {

    const event = state.event;

    synchPanel(event);

    // child state updates enabled by {sync: true} arg to spawn()
    if (event.type === "xstate.update") this.renderNodecard(event.state);

    else if (event.type === "CREATELINK") {

      const { id, label, from, to } = event;
      this.createLink({ id, label, to, from });

    } else if (event.type === "turnPhysicsOff") {

      this.setPhysics(false)

    } else if (event.type === "turnPhysicsOn") {

      this.setPhysics(true)

    } else if (event.type === "openPrompt") {

      openPrompt(event, this.controllers.prompt.close)

    } else if (event.type === "closePrompt") {

      closePrompt()

    }
  }

}

/*TODO: 
 - cards should close when app mode transitions to disabled. (DONE)
 
 - Physics should be turned on during initialization, and then turned off when it's complete. (DONE)
 
 - remove card from state machine context on DELETE event (DONE, but partially unresolved)
   (How to remove the spawned machine from the parent's children property? Maybe it's unnecessary?
    The question remains unanswered: https://stackoverflow.com/q/61013927 )

 - delete button (DONE)

 - bug: turning physics on when a nodecard is active generates console error. Caused by a redundant "turnPhysicsOn" transition on mode.active. 
 Removing it fixes the problem. (DONE)

 - extract getNodeCenter call (a method that wraps vis-network api calls) from out of the dom view (DONE)

 - popup prompt for creating cards, along with a corresponding state (DONE)

 - when the app mode is "active.readOnly" the button should be disabled
 
 - fix: prevent second click on node causing duplicate nodecard elements

 - fix: when app is in mode.modify, and card is in active.edit, if app is switched to mode.read then card is still in active.edit

 - drag button

 - webSource button

 - user creation of new cards and links


 - (maybe) try to make method names correspond to state values to obviate the jungle of conditionals in app.render, 
  eg read,edit,inert => card[state.value] 

 - separate business logic from DOM manipulation

 - bug: when prompt is opened, if we switch app mode to read only or disabled, prompt gets stuck. if you switch back to modify,
   two prompts are open at once.

 - bug: clicking edges generates error
  
 - create function that processes state data for render function
*/
