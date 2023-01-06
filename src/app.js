export default function App(
  cardFace,
  activeTemplates,
  buttonTemplates,
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

  // TODO: 'invoke' data calls from XState?
  const init = (data, send, network) => {
    settingsPanelView();
    data.cards.map(({ id, label, text, position }) => {
      // do not pass in the position here, because the physics engine generates it later on.
      // if the initial data for a node provides the position, it should be inserted into the card machine in a separate event somewhere.
      send({ type: "CREATECARD", id, label, text });
    });

    data.links.map(({ id, label, from, to }) => {
      send({ type: "CREATELINK", id, label, from, to });
    });

    setTimeout(() => {
      deck.nodecards.map((card) => {
        let canvasPosition = network.getPosition(card.id);
        let domPosition = network.canvasToDOM({
          x: canvasPosition.x,
          y: canvasPosition.y,
        });
        send({
          type: "setCardDOMPosition",
          id: card.id,
          domPosition,
        });
        send({
          type: "setCardCanvasPosition",
          id: card.id,
          canvasPosition,
        });
      });
      send({ type: "INIT.COMPLETE" });
    }, 1000); // delay transition into mode.active, allowing physics engine to lay out the nodes before it's disabled.
  };

  const createCard = ({ id, label, text, domPosition, canvasPosition }) => {
    const card = cardFace({ id, label, text, domPosition, canvasPosition });
    deck.nodecards.push(card);
    console.log("createCard ->", id);
  };

  const generateId = () => Math.random().toString().substring(2, 9);

  /*TODO:
    const createLink = (id,label,from,to) {
      const linkId = createEdge(id,label,from,to)
      deck.links.push(linkId)   
    }
  */

  const reader = (id, text) => ({
    main: activeTemplates(id, text).reader(),
    bar: buttonTemplates(id, null).readerBar(),
  });

  const editor = (id, text) => ({
    main: activeTemplates(id, text).editor(),
    bar: buttonTemplates(id, null).editorBar(),
  });

  //TODO: call this function from app-machine.js -> spawn card machine -> onTransition
  const renderNodecard = (childState) => {
    const childEvent = childState.event;
    let { id, label, text, domPosition, canvasPosition } = childState.context;

    if (childEvent.type === "xstate.init") {
      createCard({ id, label, text, domPosition, canvasPosition });
    } else {
      const card = deck.nodecards.find((card) => card.id === id);

      if (childEvent.type === "cardActivated") {
        //TODO: card.setDomPosition should be called immediately after the card machine is updated with a new domPosition
        card.setDomPosition(domPosition);
        const view = reader(id, text);
        card.inertFace.activate({
          view,
        });
      }

      if (childEvent.type === "cardDeactivated") card.activeFace.inertify(id);

      //if (childState.changed && childState.value.active === "read") -> BREAKING! called before cardActivated, precluding the creation of the dom element!
      if (childEvent.type === "SWITCH.READ") {
        //const nestedState = childState.value.active;
        console.log("read: ", childState);

        const view = reader(id, text);
        card.activeFace.choose(view);
      }
      if (childState.changed && childState.value.active === "edit") {
        //if (childEvent.type === "SWITCH.EDIT") {
        //const nestedState = childState.value.active;
        //console.log("edit: ", childState);
        //console.log("nestedState: ", nestedState);

        const view = editor(id, text);
        card.activeFace.choose(view);
      }

      if (childEvent.type === "TYPING")
        card.activeFace.updateEditor(childEvent); // controlled element

      if (childEvent.type === "DELETE") card.activeFace.discard();
    }
  };

  const render = (state, send, network) => {
    console.log("render", state);
    const event = state.event;
    synchSettingsPanel(event);

    // child state updates enabled by {sync: true} arg to spawn()
    if (event.type === "xstate.update") renderNodecard(event.state);
    else if (event.type === "convertDataBeforeCreation") {
      const domPosition = event.domPosition;
      const canvasPosition = network.DOMtoCanvas({
        x: domPosition.x,
        y: domPosition.y,
      });
      const id = generateId();
      const label = "new node";
      const text = "";
      send({
        //type: "createCardWithKnownPosition",
        type: "CREATECARD",
        domPosition,
        canvasPosition,
        id,
        label,
        text,
      });
    } else if (event.type === "CREATELINK") {
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

 - selecting "Disabled" from the panel while a nodecard is active, results in error: "_element not undefined"

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
