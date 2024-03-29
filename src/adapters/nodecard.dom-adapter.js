import { render, div, setPosition } from "../views/dom-helpers";
import activeTemplates from "../views/active-templates";
import createButtonBar from "../views/button-bar";
import "../../assets/styles/nodecard.css";


export const domAdapterFactory =
  //(activeTemplates, buttonTemplates) =>
  (getDomPosition, getText, getId, editorController, buttonsControllers, linkTargetController) => {
    //the closured variable must be a property of an object,
    //or its mutations will be inaccessible to the methods.
    let _private = { el: {} };

    return {
      ...elementRemover(_private),
      ...elementPositioner(_private, getDomPosition),
      ...containerOpener(_private, getId, linkTargetController),
      ...elementFiller(_private),
      ...editorUpdater(_private, getText),
      ...collapser(_private),
      ...readerRenderer(),
      ...editorRenderer(),
      reader: createReader(
        getId,
        getText,
        buttonsControllers,
        editorController
      ),
      editor: createEditor(
        getId,
        getText,
        buttonsControllers,
        editorController
      ),
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

const elementPositioner = (_, getDomPosition) => ({
  setElementPosition() {
    const { x, y } = getDomPosition();
    setPosition(_.el, x, y);
  },
});

const createReader =
  (getId, getText, buttonsControllers, editorController) => () => ({
    main: activeTemplates(getId(), getText(), editorController).reader(),
    bar: createButtonBar(getId(), null, buttonsControllers).readerBar(),
  });

const createEditor =
  (getId, getText, buttonsControllers, editorController) => () => ({
    main: activeTemplates(getId(), getText(), editorController).editor(),
    bar: createButtonBar(getId(), null, buttonsControllers).editorBar(),
  });

const containerOpener = (_, getId, linkTargetController) => ({
  openContainer() {
    _.el = div("nodecard", "expand");
    _.el.dataset.id = getId();
    _.el.addEventListener("click", () => linkTargetController(getId()))
    const rootStyle = getComputedStyle(document.querySelector(":root"));
    const zs = rootStyle.getPropertyValue("--zoom-scale");
    _.el.style.transform = `scale(${zs})`;
    render(_.el); // MUST RENDER BEFORE setPosition is called!!!
    this.setElementPosition();
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
