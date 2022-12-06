import { qs, render, div, setPosition } from "./dom-helpers";
import createButtonBar from "./button-bar";

export default function domViews(controllers) {
  let _element;

  const removeElement = () => {
    _element.remove();
    _element = undefined;
  };

  const expand = ({ id, x, y, nestedState, text }) => {
    _element = div("nodecard", "expand");
    console.log("element", _element);
    _element.id = id;
    render(_element); // MUST RENDER BEFORE setPosition and fillElement are called!!!
    setPosition(_element, x, y);
    fillElement(id, nestedState, text);
  };

  const fillElement = (id, state, text) => {
    //const el = qs("#" + id);
    // TODO: inject controller and one of the templates; the choice about which template is made higher up.
    const choice = chooseView(id, state, text);

    //TODO: add source argument
    const source = null;
    //const btnTemplates = buttonTemplates(controllers)
    //TODO: inject button data
    const bar = createButtonBar(state, source, controllers);

    insertView(choice);
    insertBar(bar);
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

  const chooseView = (id, state, text) => {
    //TODO: lift these templates and inject them down, allowing business logic to choose.
    let choose = {
      read: (text) => {
        const reader = div("reader");
        reader.innerHTML = htmlText(text);
        return reader;
      },

      edit: (text) => {
        const editor = document.createElement("textarea");
        editor.classList.add("editor");
        editor.value = text;
        editor.addEventListener("input", (e) => {
          controllers.editor(e, id);
        });

        return editor;
      },
    };

    return choose[state](text);
  };

  // is this function even necessary??
  const updateEditor = ({ text, id }) => {
    //qs("#" + id).firstElementChild.value = text;
    _element.firstElementChild.value = text;
  };

  const htmlText = (text) => {
    if (text) {
      return text
        .replace(/\n/g, "<br>")
        .replace(/\t/g, "&nbsp; &nbsp; &nbsp; &nbsp;");
    }
  };

  const collapse = (id) => {
    console.log("collapse, element", _element);
    //id = "#" + id;
    //if (qs(id)) {
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
