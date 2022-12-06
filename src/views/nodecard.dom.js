import { qs, render, div, setPosition } from "./dom-helpers";
import createButtonBar from "./button-bar";

export default function domViews(controllers) {
  let _element;

  const removeElement = (sel) => {
    try {
      qs(sel).remove();
    } catch (e) {
      return e;
    }

    /*
    if (qs(sel)) {
      qs(sel).remove();
    }
    else {
      throw new Error('element not found!')
    }
    */
  };

  const expand = ({ id, x, y, nestedState, text }) => {
    //const el = div("nodecard", "expand");
    _element = div("nodecard", "expand");
    let el = _element;
    el.id = id;
    render(el); // MUST RENDER BEFORE setPosition and fillElement are called!!!
    setPosition(el, x, y);
    fillElement(id, nestedState, text);
  };

  const fillElement = (id, state, text) => {
    const el = qs("#" + id);
    // TODO: inject controller and one of the templates; the choice about which template is made higher up.
    const choice = chooseView(id, state, text);

    //TODO: add source argument
    const source = null;
    //const btnTemplates = buttonTemplates(controllers)
    //TODO: inject button data
    const bar = createButtonBar(state, source, controllers);

    insertView(el, choice);
    insertBar(el, bar);
  };

  const insertView = (parent, view) => {
    // TODO: lift business logic up into higher levels
    if (parent.hasChildNodes()) parent.firstElementChild.replaceWith(view);
    else render(view, parent);
  };

  const insertBar = (parent, bar) => {
    if (parent.lastElementChild.classList.contains("button-bar")) {
      parent.lastElementChild.replaceWith(bar);
    } else render(bar, parent);
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
    qs("#" + id).firstElementChild.value = text;
  };

  const htmlText = (text) => {
    if (text) {
      return text
        .replace(/\n/g, "<br>")
        .replace(/\t/g, "&nbsp; &nbsp; &nbsp; &nbsp;");
    }
  };

  const collapse = (id) => {
    id = "#" + id;
    if (qs(id)) {
      qs(id).classList.replace("expand", "collapse");

      // delay the removal of the DOM element, otherwise the collapse animation doesn't occur
      setTimeout(() => {
        removeElement(id);
      }, 600);
    }
  };

  return {
    removeElement,
    setPosition,
    expand,
    fillElement,
    updateEditor,
    collapse,
    setPosition,
  };
}
