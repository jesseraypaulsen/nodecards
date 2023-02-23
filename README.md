# Nodecards

Extends a graph rendering library and adapts it into a personal knowledge management system. An exaptation. Using vis-network and XState.

---

## Todos

- bug: drag delay (consider: data from the originating click event and its relation to the drag handler)

- bug: after you zoom out, when you drag the active card the element and the node fall out of synch

- bug: when the card is in "active.locked" some of the buttons should be disabled.

- styles for link creation

- refactor to improve structure, see app.js

- bug: sometimes the nodecard opens when the node is dragged.
  https://visjs.github.io/vis-network/docs/network/index.html#Events
  NOTE: the vis-network events have an event property that holds the original DOM event -- this might be useful for a condition.

- adapt to mobile

- guided tour

- create a better dataset.

- deploy on a cloud service.

- screencasts and/or snapshots (desktop)

- tests

---

DONE

- feat: scale a nodecard's dom element when zooming the graph <span style="font-size: 1.2em; color:green">✔</span>

- bug: sometimes dom element becomes decoupled somehow from graph node when double-click and drag happen in immediate succession on an inert node, followed by the exception "getCanvasPosition is undefined" <span style="font-size: 1.2em; color:green">✔</span>

- bug: if you drag the inert node first, and then open the card and attempt to drag the card then you "Uncaught TypeError: destructured parameter is undefined". But then if you inertify the card, and re-open it, then drag works fine. The error points to drag.js and the addDeltas function. <span style="font-size: 1.2em; color:green">✔</span>

- bug: dragging or resizing the view when a nodecard is active throws the dom element and the graph node out of synch. the element position needs to be updated whenever setDomPosition is called on the nodecard instance, conditioned on the card machine being in the active state. <span style="font-size: 1.2em; color:green">✔</span>

- synchronize position changes across UI and XState, using "stabilized", "dragging", and "resize" events from vis.network <span style="font-size: 1.2em; color:green">✔</span>

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
