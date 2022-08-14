import { typeofSelection } from "./utils";
import { turnTogglerSwitchOff } from "./switch-panel";
export default handler;

async function handler(data, deck) {
  const {
    pointer: { canvas, DOM },
  } = data;
  let pt = {
    canX: canvas.x,
    canY: canvas.y,
    domX: DOM.x,
    domY: DOM.y,
  };

  let click = typeofSelection(data); // 'BG' or 'NC'?
  let clickedCard = null;

  if (click === "NC") {
    clickedCard = click === "NC" ? deck.getCard(data.nodes[0]) : null;
    //if (clickedCard) clickedCard.oPt = deck.getNodeCenter(data.nodes[0]);
  }

  // linkcards are currently not implemented
  if (click === "LC") {
    console.log(data.edges[0]);
  }

  if (deck.currCard.state === "empty") {
    if (click === "BG") {
      if (deck.settings.write) {
        log("A", 1, deck);
        let newCard = await deck.createCard({
          pt: pt,
          state: "floating",
          mode: "write",
        });
        deck.currCard = newCard;
        log("A", 2, deck);
      }
      return;
    }
    if (click === "NC") {
      if (deck.settings.read) {
        log("B", 1, deck);
        deck.currCard = clickedCard;
        deck.currCard.setMode("read");
        log("B", 2, deck);
        return;
      }
    }
  }

  if (deck.currCard.state === "floating") {
    if (click === "BG") {
      if (deck.settings.write) {
        log("C", 1, deck);
        deck.currCard.move(pt);
        log("C", 2, deck);
        return;
      } else {
        log("C", 1, deck);
        deck.discard(deck.currCard.id);
        deck.currCard = { state: "empty" };
        log("C", 2, deck);
      }
    }
    if (click === "NC") {
      log("D", 1, deck);
      deck.discard(deck.currCard.id);
      deck.currCard = clickedCard;
      if (deck.settings.read) {
        deck.currCard.setMode("read");
      }
      log("D", 2, deck);
      return;
    }
  }

  if (deck.currCard.state === "fixed") {
    if (click === "BG") {
      log("E", 1, deck);
      turnTogglerSwitchOff();
      const sourceId = deck.currCard.id;
      deck.currCard.setMode("inert");

      // previousMode is a state variable used to condition for tangent vs annotate.
      let edgetype = "";
      if (deck.currCard.previousMode === "read") {
        edgetype = "annotate";
      } else if (deck.currCard.previousMode === "write") {
        edgetype = "tangent";
      }

      if (deck.settings.write) {
        let newCard = await deck.createCard({
          pt,
          state: "floating",
          mode: "write",
        });

        deck.currCard = newCard;
        const targetId = deck.currCard.id;

        if (deck.settings.nonlinear) {
          deck.createLink({ sourceId, targetId, edgetype });
        }
      }

      log("E", 2, deck);
      return;
    }
    if (click === "NC") {
      log("F", 1, deck);
      deck.currCard.setMode("inert");
      deck.currCard = clickedCard;
      if (deck.settings.read) {
        deck.currCard.setMode("read");
      }
      log("F", 2, deck);
      return;
    }
  }
}

function log(section, phase, deck) {
  const on = true; // true to turn the logger on
  if (on) {
    if (phase === 1) phase = "start";
    if (phase === 2) phase = "end";
    console.log(`section ${section}, ${phase} state: ${deck.currCard.state}`);
  }
}
