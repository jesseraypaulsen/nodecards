import fillTemplates from "./button-templates";
import { div, span } from "./dom-helpers";

//createButtonBar
export default (controllers) => (id, source, sendToMachine) => {
  const templates = fillTemplates(controllers, id, source);

  let buttons = {};
  for (let key in templates) {
    buttons[key] = createButton(templates[key]);
  }
  return diverge(buttons);
};

function diverge({ drag, edit, read, discard, source, inertify }) {
  return {
    readerBar: () => createBar([drag, edit, discard, source, inertify]),
    editorBar: () => createBar([drag, read, discard, source, inertify]),
  };
}

function createBar(buttons) {
  const bar = div("button-bar");
  bar.append(...buttons);
  return bar;
}

function createButton({ icon, handler, eventType, classNames, active }) {
  const button = span(...classNames);

  let img = document.createElement("img");
  img.src = icon;
  button.appendChild(img);

  // business logic; depends on whether the app is in the modify state.
  // should depend on a template chosen by XState.
  if (!active) button.classList.add("inactive");

  button.addEventListener(eventType, handler);

  return button;
}
