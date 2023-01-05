import { render, div, setPosition } from "./dom-helpers";

export const domFaceFactory = () => {
  //the closured variable must be a property of an object,
  //or its mutations will be inaccessible to the methods.
  let _private = { el: {} };

  return {
    ...elementRemover(_private),
    ...expander(_private),
    ...elementFiller(_private),
    ...editorUpdater(_private),
    ...collapser(_private),
  };
};
/* 
  The factory wrappers allow us inject the private variable so we can export the methods individually for unit testing.
  But that purpose is defeated when methods call other methods -- as they must do so via 'this'. So the entire instance has to be mocked. 

  To make 'this' point to the domFace instance, the "method definition" syntax is used for each method.
*/

export const elementRemover = (_) => ({
  removeElement() {
    _.el.remove();
    _.el = undefined;
  },
});

const expander = (_) => ({
  expand({ x, y, view }) {
    _.el = div("nodecard", "expand");
    this.fillElement(view);
    render(_.el); // MUST RENDER BEFORE setPosition is called!!!
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
    _.el.firstElementChild.focus();
  },
});

export const collapser = (_) => ({
  collapse() {
    if (_.el) {
      _.el.classList.replace("expand", "collapse");

      // collapse animation requires delaying removal
      setTimeout(() => {
        this.removeElement();
      }, 600);
    }
  },
});
