- bug: drag delay (consider: data from the originating click event and its relation to the drag handler)

- bug: when the card is in "active.locked" some of the buttons should be disabled.

- styles for link creation

- bug: sometimes the nodecard opens when the node is dragged.
  https://visjs.github.io/vis-network/docs/network/index.html#Events
  NOTE: the vis-network events have an event property that holds the original DOM event -- this might be useful for a condition.

---

- bug: dragging or resizing the view when a nodecard is active throws the dom element and the graph node out of synch. the element position needs
  to be updated whenever setDomPosition is called on the nodecard instance.

---

- adapt to mobile

- guided tour

- create a better dataset.

- deploy on a cloud service.

- create README.md (definition: extension for graph renderer that turns it into a PKM system)

- screencast

- tests

---

DONE

- synchronize position changes across UI and XState, using "stabilized", "dragging", and "resize" events from vis.network

- bug: when the app machine is in mode.enabled.linkCreation_ON, clicking on a nodecard's lock/unlock button causes exception because the catchActiveCardEvent
  handler retrieves the nodecard id from the target element (button bar), but the lock/unlock causes the button bar to be re-created

- bug: upon card creation, if user clicks a third time then two divs are opened

- create card on doubleClick event; eliminate intervening prompt

- feat: the active state in card machines has a history node, so it can remember whether is was locked/unlocked before it was inertified <span style="font-size: 1.2em; color:green">✔</span>
- bug: if linkCreation button is clicked and then the user clicks on another active card, the link only gets rendered if the click is not on the buttons or
  the textarea -- though, a link is created in DeckManager but with the "to" property left undefined. <span style="font-size: 1.2em; color:green">✔</span>

- feat: clicking a link invokes a prompt for deleting the link. <span style="font-size: 1.2em; color:green">✔</span>

- feat: link creation between two pre-existing nodecards when the target card is active <span style="font-size: 1.2em; color:green">✔</span>

- feat: link creation between two pre-existing nodecards when the target card is inert <span style="font-size: 1.2em; color:green">✔</span>

- change lock/unlock buttons. <span style="font-size: 1.2em; color:green">✔</span>

- bug: when prompt is opened, if we switch app mode to read only or disabled, prompt gets stuck. if you switch back to modify, two prompts are open at once. <span style="font-size: 1.2em; color:green">✔</span>

- bug: second click on node causes duplicate nodecard elements. (update: I think I inadvertently fixed this problem, because I can't replicate it at the moment.) <span style="font-size: 1.2em; color:green">✔</span>

- bug: when app is in mode.modify, and card is in active.edit, if app is switched to mode.read then card is still in active.edit <span style="font-size: 1.2em; color:green">✔</span>

- state processing functions for parentEffects and childEffects <span style="font-size: 1.2em; color:green">✔</span>

- eliminated superfluous states and transitions <span style="font-size: 1.2em; color:green">✔</span>

- nodecards should always start in active.unlocked <span style="font-size: 1.2em; color:green">✔</span>

- <s>add 'source' argument to createButtonBar</s>

- <s>nodecards always activate in read mode. they should activate in write mode when they are user created.</s>

---

SOMEDAY/MAYBE

- investigate vis-network methods for various uses, including startSimulation, stopSimulation, unselectAll, setSelection, releaseNode, moveTo, etc
  (eg, startSimulation might be easier than the current way I'm turning physics on). https://visjs.github.io/vis-network/docs/network/index.html

- investigate getBoundingBox among the methods above, but also investigate the vis-network source code to see how the bounding box works and interacts
  with edges. These files look promising for further investigation:
  /network/modules/components/nodes/NodeBase.js
  /network/modules/components/Node.js
  /network/NetworkUtil.js

- different ways of dealing with card collisions. each way would have a corresponding state. eg, when opening a card collides with a
  previously opened card -- in one state the previously opened card might shrink somewhat, while in the default state the newly opened card overlaps
  the previously opened one (which is how it currently works by default).
