import { render, div, setPosition } from "./dom-helpers";

export default function domViews() {
  let _element;

  const removeElement = () => {
    _element.remove();
    _element = undefined;
  };

  const expand = ({ x, y, view }) => {
    _element = div("nodecard", "expand");
    render(_element); // MUST RENDER BEFORE setPosition and fillElement are called!!!
    setPosition(_element, x, y);
    fillElement(view);
  };

  const fillElement = ({ main, bar }) => {
    while (_element.hasChildNodes()) {
      _element.lastElementChild.remove();
    }

    _element.append(main, bar);
    //insertView(main);
    //insertBar(bar);
  };

  /*
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
  */

  // is this function even necessary??
  const updateEditor = ({ text, id }) => {
    _element.firstElementChild.value = text;
  };

  const collapse = () => {
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
