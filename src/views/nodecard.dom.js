import { render, div, setPosition } from "./dom-helpers";

export default function domFaceFactory() {
  let _private = { el: {} };

  return {
    ...elementRemover(_private),
    ...expander(_private),
    ...elementFiller(_private),
    ...editorUpdater(_private),
    ...collapser(_private),
  };
}

const elementRemover = (_) => ({
  removeElement() {
    _.el.remove();
    _.el = undefined;
  },
});

const expander = (_) => ({
  expand({ x, y, view }) {
    _.el = div("nodecard", "expand");
    this.fillElement(view);
    render(_.el); // MUST RENDER BEFORE setPosition and fillElement are called!!!
    setPosition(_.el, x, y);
  },
});

const elementFiller = (_) => ({
  fillElement({ main, bar }) {
    while (_.el.hasChildNodes()) {
      _.el.lastElementChild.remove();
    }

    _.el.append(main, bar);
  },
});

const editorUpdater = (_) => ({
  updateEditor(text) {
    _.el.firstElementChild.value = text;
  },
});

const collapser = (_) => ({
  // method definition so 'this' will be the factory's resulting object
  collapse() {
    if (_.el) {
      _.el.classList.replace("expand", "collapse");

      // delay the removal of the DOM element, otherwise the collapse animation doesn't occur
      setTimeout(() => {
        this.removeElement();
      }, 600);
    }
  },
});
