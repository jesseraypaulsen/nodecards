import { isValid } from "./utils";

export default function Render(
  runParentEffect,
  synchSettingsPanel,
  hydrateCard,
  hydrateLink,
  peripheralEffects
) {
  // TODO: 'invoke' data calls from XState?
  const init = (data) => {
    data.cards.map(({ id, label, text, position }) => {
      hydrateCard({ id, label, text });
    });

    data.links.map(({ id, label, from, to }) => {
      hydrateLink({ id, label, from, to });
    });
  };

  const render = (state, event) => {
    synchSettingsPanel(event);
    const { eventType, data } = processParentState(state, event);
    if (isValid(peripheralEffects, eventType))
      peripheralEffects[eventType](data);
    else runParentEffect(eventType, data);
  };

  return { init, render };
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
