export default function App(
  nodecardViewFactory,
  switchPanelView,
  { openPrompt, closePrompt },
  synchPanel,
  setPhysics,
  createEdge,
  send
) {
  // deck of nodecard VIEWS
  let deck = {
    nodecards: [],
    links: [],
  };

  // TODO: 'invoke' data calls from XState?

  const init = (data) => {
    switchPanelView();

    data.cards.map(({ id, label, text }) => {
      send({ type: "CREATECARD", id, label, text });
    });

    data.links.map(({ id, label, from, to }) => {
      send({ type: "CREATELINK", id, label, from, to });
    });

    setTimeout(() => {
      send({ type: "INIT.COMPLETE" });
    }, 1000); // delay transition into mode.active, allowing physics engine to lay out the nodes before it's disabled.
  };

  const createCardView = (id, label, text) => {
    const card = nodecardViewFactory({ id, label, text });
    deck.nodecards.push(card);
    //deck.nodecards = [...deck.nodecards, card];
  };

  /*TODO:
    const createLink = (id,label,from,to) {
      const linkId = createEdge(id,label,from,to)
      deck.linkIds = [...deck.links, linkId];    
    }
  */

  const renderNodecard = (childState) => {
    const childEvent = childState.event;
    let { id, label, text } = childState.context;

    if (childEvent.type === "xstate.init") {
      createCardView(id, label, text);
    } else {
      const card = deck.nodecards.find((card) => card.id === id);

      if (childEvent.type === "cardActivated") {
        const { x, y } = childEvent;
        const nestedState = childState.value.active;
        card.inertFace.activate({ id, x, y, nestedState, text });
      }

      if (childState.value === "inert") card.activeFace.inertify(id);

      /*TODO:
      
      if (
        childEvent.type === "SWITCH.EDIT"
      ) {
        const cardTemplate = generateView(controller, editorTemplate);
        const barTemplate = createBar(editorBarTemplate)
        insertView(cardTemplate)
        insertBar(barTemplate)
      }
      
      if (
        childEvent.type === "SWITCH.READ"
      ) {
        const cardTemplate = generateView(controller, readTemplate);
        const barTemplate = createBar(readBarTemplate)
        insertView(cardTemplate)
        insertBar(barTemplate)
      }
      
      */
      if (
        childEvent.type === "SWITCH.EDIT" ||
        childEvent.type === "SWITCH.READ"
      ) {
        const nestedState = childState.value.active;

        //TODO: inject views
        card.activeFace.fillElement(id, nestedState, text);

        /* If we test state.event.state.value for 'read'/'edit', that doesn't tell me if the state has changed from 'read' to 'edit' or vice versa.
          So evaluating the event type is necessary, because we only want to renderState when there's a change. 
          state.changed doesn't seem to help because "state.value.changed" is invalid, and active is a compound state. */
      }

      if (childEvent.type === "TYPING")
        card.activeFace.updateEditor(childEvent); // controlled element

      if (childEvent.type === "DELETE") card.activeFace.discard(id);
    }
  };

  const render = (state) => {
    console.log("state", state);
    const event = state.event;

    synchPanel(event);

    // child state updates enabled by {sync: true} arg to spawn()
    if (event.type === "xstate.update") renderNodecard(event.state);
    else if (event.type === "CREATELINK") {
      const { id, label, from, to } = event;

      createEdge(id, label, from, to); //TODO: createLink
    } else if (event.type === "turnPhysicsOff") {
      setPhysics(false);
    } else if (event.type === "turnPhysicsOn") {
      setPhysics(true);
    } else if (event.type === "openPrompt") {
      openPrompt(event);
    } else if (event.type === "closePrompt") {
      closePrompt();
    }
  };

  return { init, render };
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

 - separate business logic from DOM manipulation (DONE)

 - bug: when prompt is opened, if we switch app mode to read only or disabled, prompt gets stuck. if you switch back to modify,
   two prompts are open at once.

 - bug: clicking edges generates error
  
 - create function that processes state data for render function

 - when physics is turned on, an error related to the nodecard dom element occurs

 - add 'source' argument to createButtonBar

 - investigate vis-network methods for various uses, including startSimulation, stopSimulation, unselectAll, setSelection, releaseNode, moveTo, etc 
 (eg, startSimulation might be easier than the current way I'm turning physics on). https://visjs.github.io/vis-network/docs/network/index.html

 - investigate getBoundingBox among the methods above, but also investigate the vis-network source code to see  how the bounding box works and interacts 
 with edges. These files look promising for further investigation:
 /network/modules/components/nodes/NodeBase.js
 /network/modules/components/Node.js
 /network/NetworkUtil.js

 - create alternative positions for nodecard elements -- currently the only position is to map an element's center onto the node's center. but this
 means that when a node is located close to the edges of the canvas the corresponding element is rendered partly outside of the viewport. currently
 i deal with this by restricting the size of the canvas. note that different positioning types require different css animations.

 - we need several different ways of dealing with card collisions. each way should have a corresponding state. eg, when opening a card collides with a 
 previously opened card -- in one state the previously opened card might shrink somewhat, while in another state the newly opened card might overlap
 the previously opened one.

*/
