import { isValid } from "./utils";

export default function App(
  runParentEffect,
  synchSettingsPanel,
  wrappers,
  peripheralEffects
) {
  const { hydrateCard, hydrateLink, setPositionAfterCreation } = wrappers;

  // TODO: 'invoke' data calls from XState?
  const init = (data) => {
    data.cards.map(({ id, label, text, position }) => {
      hydrateCard({ id, label, text });
    });

    data.links.map(({ id, label, from, to }) => {
      hydrateLink({ id, label, from, to });
    });
  };

  const render = (state, event, send) => {
    //const event = state.event;
    synchSettingsPanel(event);

    // child state updates enabled by {sync: true} arg to spawn()
    if (event.type === "xstate.update" && event.state.changed === undefined) {
      //For the "xstate.update" event that fires when card machines are spawned, state.changed evaluates to undefined.
      //For some "xstate.update" events, state.changed evaluates to false, so testing for falsey doesn't work.

      if (state.matches("mode.initializing")) {
        const data = ({ id, label, text } = event.state.context);
        runParentEffect("hydrateCard", { ...data, send });
        setPositionAfterCreation(id, 1000);
      } else if (state.matches("mode.active")) {
        const data = ({ id, label, text, domPosition, canvasPosition } =
          event.state.context);
        runParentEffect("createCard", { ...data, send });
      }
    } else if (event.type === "hydrateLink" || event.type === "destroyCard") {
      const data = ({ id, label, from, to } = event);
      runParentEffect(event.type, data);
    } else if (isValid(peripheralEffects, event.type))
      peripheralEffects[event.type](event);
  };

  return { init, render };
}

/*TODO: 
 
 - remove card from state machine context on DELETE event (DONE, but partially unresolved)
   (How to remove the spawned machine from the parent's children property? Maybe it's unnecessary?
    The question remains unanswered: https://stackoverflow.com/q/61013927 )
 
 - when the app mode is "active.readOnly" the button should be disabled
 
 - fix: prevent second click on node causing duplicate nodecard elements

 - fix: when app is in mode.modify, and card is in active.edit, if app is switched to mode.read then card is still in active.edit

 - bug: when prompt is opened, if we switch app mode to read only or disabled, prompt gets stuck. if you switch back to modify,
   two prompts are open at once.
  
 - create function that processes state data for render function

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
