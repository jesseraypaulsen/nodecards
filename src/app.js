export default function App(
  cardFace,
  settingsPanelView,
  { openPrompt, closePrompt },
  synchSettingsPanel,
  setPhysics,
  createEdge
) {
  // deck of nodecard VIEWS
  let deck = {
    nodecards: [],
    links: [],
  };

  const createCard = ({
    id,
    label,
    text,
    domPosition,
    canvasPosition,
    machineRef,
  }) => {
    const card = cardFace({
      id,
      label,
      text,
      domPosition,
      canvasPosition,
      machineRef,
    });
    //card.machine = machine;
    deck.nodecards.push(card);
    console.log("createCard -> ", deck.nodecards);
  };

  const destroyCard = (id) => {
    deck.nodecards = [...deck.nodecards.filter((card) => card.getId() !== id)];
  };

  const getCard = (id) => deck.nodecards.find((card) => card.getId() === id);

  const generateId = () => Math.random().toString().substring(2, 9);

  /*TODO:
    const createLink = (id,label,from,to) {
      const linkId = createEdge(id,label,from,to)
      deck.links.push(linkId)   
    }
  */

  // TODO: 'invoke' data calls from XState?
  const init = (data, send, network) => {
    settingsPanelView();
    data.cards.map(({ id, label, text, position }) => {
      send({ type: "hydrateCard", id, label, text });
    });

    data.links.map(({ id, label, from, to }) => {
      send({ type: "hydrateLink", id, label, from, to });
    });

    // delay transition into mode.active, allowing physics engine to lay out the nodes before it's disabled.
    setTimeout(() => {
      send({ type: "INIT.COMPLETE" });
      console.log(deck);
    }, 1000);
  };

  //TODO: call this function from app-machine.js -> spawn card machine -> onTransition
  const renderNodecard = (childState) => {
    const childEvent = childState.event;
    let { id, label, text, domPosition, canvasPosition } = childState.context;

    //if (childEvent.type === "xstate.init")
    const card = getCard(id);
    //card.machine.send("test");

    if (childEvent.type === "cardActivated") {
      //TODO: card.setDomPosition should be called immediately after the card machine is updated with a new domPosition
      card.setDomPosition(domPosition);
      card.inertFace.activate();
    }

    if (childEvent.type === "cardDeactivated") card.activeFace.inertify();

    //if (childState.changed && childState.matches("active.reading")) -> BREAKING! called before cardActivated, precluding the creation of the dom element!
    if (childEvent.type === "READ") {
      card.activeFace.renderReader();
    }
    if (childState.changed && childState.matches("active.editing")) {
      //if (childEvent.type === "SWITCH.EDIT")
      card.activeFace.renderEditor();
    }

    if (childEvent.type === "TYPING") {
      card.setText(childEvent.text);
      card.activeFace.updateEditor(); // controlled element
    }
    if (childEvent.type === "DELETE") {
      card.activeFace.discard();
      destroyCard(id);
    }
  };

  const positionAfterCreation = (id, send, network) => {
    // delay until after the machine transitions from mode.intializing to mode.active, so that physics engine is turned off.
    // otherwise the position data will not be accurate.
    setTimeout(() => {
      let canvasPosition = network.getPosition(id);
      let domPosition = network.canvasToDOM({
        x: canvasPosition.x,
        y: canvasPosition.y,
      });
      console.log(id, domPosition, canvasPosition);
      send({
        type: "setCardDOMPosition",
        id,
        domPosition,
      });
      send({
        type: "setCardCanvasPosition",
        id,
        canvasPosition,
      });
    }, 1000);
  };

  const positionBeforeCreation = (domPosition, send, network) => {
    const canvasPosition = network.DOMtoCanvas({
      x: domPosition.x,
      y: domPosition.y,
    });
    const id = generateId();
    const label = "new node";
    const text = "";
    send({
      type: "CREATECARD",
      domPosition,
      canvasPosition,
      id,
      label,
      text,
    });
  };

  const render = (state, send, network) => {
    console.log("render", state);
    const event = state.event;
    synchSettingsPanel(event);

    // child state updates enabled by {sync: true} arg to spawn()
    if (event.type === "xstate.update" && event.state.changed === undefined) {
      //For the "xstate.update" event that fires when card machines are spawned, state.changed evaluates to undefined.
      //For some "xstate.update" events, state.changed evaluates to false, so testing for falsey doesn't work.
      const { id, label, text, domPosition, canvasPosition } =
        event.state.context;
      const item = state.context.cards.find((card) => card.id === id);
      createCard({
        id,
        label,
        text,
        domPosition,
        canvasPosition,
        machineRef: item.ref,
      });
      if (state.matches("mode.initializing")) {
        positionAfterCreation(id, send, network);
      }
    } else if (event.type === "xstate.update") renderNodecard(event.state);
    else if (event.type === "convertDataBeforeCreation") {
      // is this event even necessary? why not just call the function directly from dom.controllers.js instead of sending another event?
      positionBeforeCreation(event.domPosition, send, network);
    } else if (event.type === "hydrateLink") {
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

 - separate business logic from DOM manipulation (DONE)
 
 - when the app mode is "active.readOnly" the button should be disabled
 
 - fix: prevent second click on node causing duplicate nodecard elements

 - fix: when app is in mode.modify, and card is in active.edit, if app is switched to mode.read then card is still in active.edit

 - drag button

 - webSource button

 - user creation of new cards and links


 - (maybe) try to make method names correspond to state values to obviate the jungle of conditionals in app.render, 
  eg read,edit,inert => card[state.value] 


 - bug: when prompt is opened, if we switch app mode to read only or disabled, prompt gets stuck. if you switch back to modify,
   two prompts are open at once.

 - bug: clicking edges generates error
  
 - create function that processes state data for render function

 - when physics is turned on while a nodecard is active, an error related to the nodecard dom element occurs

 - selecting "Disabled" from the panel while a nodecard is active, results in error: "_element not undefined" (DONE)

 - add 'source' argument to createButtonBar

 - bug: when browser content window resizes (such as by opening browser console) the graph renderer adjusts its rendering,
 but the nodecard dom elements do not adjust -- throwing the graph and DOM out of synch.

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
