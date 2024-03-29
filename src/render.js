import { isValid } from "./utils";

export default function Render(
  runParentEffect,
  synchSettingsPanel,
  hydrateCard,
  hydrateLink,
  peripheralEffects,
  hydratePositionedCard
) {

  // initialize when the dataset does not provide positions for the nodes.
  // the layout algorithm will generate positions. the state machine
  // should be set to start in the mode.initializing state. the state machine will then move to
  // mode.enabled after a period of time, and in this state physics will be turned off.
  const init = (data) => {
    data.cards.map(({ id, label, text }) => {
      hydrateCard({ id, label, text });
    });

    data.links.map(({ id, label, from, to }) => {
      hydrateLink({ id, label, from, to });
    });
  };

  // initialize positioned data. the state machine should be set to start in the mode.enabled state.
  const initPositioned = (data) => {
    // data.cards.map(({ id, label, text, x, y }) => {
    //   hydratePositionedCard({ id, label, text, x, y });
    // });
    data.cards.map(props => {
      hydratePositionedCard({ ...props, startInert: true });
    });

    // data.links.map(l => {
    //   if (l.arrows) {
    //     const { id, label, from, to, arrows } = l;
    //     hydrateLink({ id, label, from, to, arrows })
    //   }
    //   else {
    //     const { id, label, from, to } = l;
    //     hydrateLink({ id, label, from, to })
    //   }
    // })
    data.links.map(l => {
      hydrateLink(l)
    })

  }

  const render = (state, event) => {
    synchSettingsPanel(event);
    const { eventType, data } = processParentState(state, event);
    if (isValid(peripheralEffects, eventType))
      peripheralEffects[eventType](data);
    else runParentEffect(eventType, data);
  };

  return { init: initPositioned, render };
}

function processParentState(state, event) {
  let eventType, data;
  if (
    event.type === "xstate.update" &&
    event.state.event.type === "xstate.init"
  ) {
    data = event.state.context;
    if (state.matches("mode.initializing")) {
      eventType = "hydrateCard";
    } else if (state.matches("mode.enabled")) {
      eventType = "createCard";
    }
  } else {
    eventType = event.type;
    data = event;
  }
  return { eventType, data };
}
