import { render, div, setPosition } from "./dom-helpers";

export default function domViews() {
  let _element;

  const removeElement = () => {
    _element.remove();
    _element = undefined;
  };

  const expand = ({ id, x, y, nestedState, text, template, buttonBar }) => {
    _element = div("nodecard", "expand");
    render(_element); // MUST RENDER BEFORE setPosition and fillElement are called!!!
    setPosition(_element, x, y);
    fillElement(id, nestedState, text, template, buttonBar);
  };

  const fillElement = (id, state, text, template, buttonBar) => {
    // replace these with one function that recursively removes elements and then appends new ones
    insertView(template);
    insertBar(buttonBar);
  };

  const insertView = (view) => {
    // TODO: lift business logic up into higher levels
    if (_element.hasChildNodes()) _element.firstElementChild.replaceWith(view);
    else render(view, _element);
  };

  const insertBar = (bar) => {
    if (_element.lastElementChild.classList.contains("button-bar")) {
      _element.lastElementChild.replaceWith(bar);
    } else render(bar, _element);
  };

  // is this function even necessary??
  const updateEditor = ({ text, id }) => {
    _element.firstElementChild.value = text;
  };

  const collapse = (id) => {
    console.log("collapse, element", _element);
    if (_element) {
      _element.classList.replace("expand", "collapse");

      // delay the removal of the DOM element, otherwise the collapse animation doesn't occur
      setTimeout(() => {
        removeElement();
        console.log("element", _element);
      }, 600);
    }
  };

  return {
    removeElement,
    expand,
    fillElement,
    updateEditor,
    collapse,
  };
}
