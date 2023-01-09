import { render, div, setPosition } from "./dom-helpers";

export const domAdapterFactoryFactory =
  (activeTemplates, buttonTemplates) => (getDomPosition, getText, getId) => {
    //the closured variable must be a property of an object,
    //or its mutations will be inaccessible to the methods.
    let _private = { el: {} };

    return {
      ...elementRemover(_private),
      ...expander(_private, getDomPosition),
      ...elementFiller(_private),
      ...editorUpdater(_private, getText),
      ...collapser(_private),
      ...readerRenderer(),
      ...editorRenderer(),
      reader: createReader(activeTemplates, buttonTemplates, getId, getText),
      editor: createEditor(activeTemplates, buttonTemplates, getId, getText),
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

const createReader =
  (activeTemplates, buttonTemplates, getId, getText) => () => ({
    main: activeTemplates(getId(), getText()).reader(),
    bar: buttonTemplates(getId(), null).readerBar(),
  });

const createEditor =
  (activeTemplates, buttonTemplates, getId, getText) => () => ({
    main: activeTemplates(getId(), getText()).editor(),
    bar: buttonTemplates(getId(), null).editorBar(),
  });

const expander = (_, getDomPosition) => ({
  expand() {
    _.el = div("nodecard", "expand");
    this.renderReader();
    render(_.el); // MUST RENDER BEFORE setPosition is called!!!
    const { x, y } = getDomPosition();
    setPosition(_.el, x, y);
  },
});

const readerRenderer = () => ({
  renderReader() {
    this.fillElement(this.reader());
  },
});

const editorRenderer = () => ({
  renderEditor() {
    this.fillElement(this.editor());
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

const editorUpdater = (_, getText) => ({
  updateEditor() {
    _.el.firstElementChild.value = getText();
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
