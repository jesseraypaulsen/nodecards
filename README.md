# Nodecards

Extends a graph rendering library and adapts it into a personal knowledge management system. An exaptation. Using vis-network and XState.

---

## Todos

- bug: drag delay (consider: data from the originating click event and its relation to the drag handler)

- bug: after you zoom out, when you drag the active card the element and the node fall out of synch. likewise if you open the console (or close it if it was open when the app first loaded), or change the browser vieport size in any other way.

- bug: when the card is in "active.locked" some of the buttons should be disabled.

- refactor to improve structure, see app.js

- bug: sometimes the nodecard opens when the node is dragged.
  https://visjs.github.io/vis-network/docs/network/index.html#Events
  NOTE: the vis-network events have an event property that holds the original DOM event -- this might be useful for a condition.

- the drag event doesn't work in mobile

- guided tour

- create a better dataset.

- add confirmation for deleting cards

- after branch is clicked, the first card should temporarily change appearance somehow, and then maybe it should collapse when second card is created/selected.

- some way of deriving titles for the collapsed nodes. you could specify a special syntax for marking the title within the text content.

- hide canvas node when card is expanded.. now that the card is smaller the node momentarily peeks out beyond the edges of the card when you're dragging it. perhaps using the 'opacity' property.. see https://visjs.github.io/vis-network/docs/network/nodes.html. you might be able to put this property on the card machine. see app.js, library-wrapper.js, app-machine.js and card-machine.js .

- animation effect on buttons

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
