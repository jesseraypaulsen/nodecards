import { isValid, processState } from "./utils";

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

    const { eventType, data } = processState(state, event);

    if (isValid(peripheralEffects, eventType))
      peripheralEffects[eventType](data);
    else runParentEffect(eventType, data);
  };

  return { init, render };
}
