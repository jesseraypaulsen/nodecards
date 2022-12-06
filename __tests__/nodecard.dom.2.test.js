import domViews from "../src/views/nodecard.dom";
import * as helpers from "../src/views/dom-helpers";

test("removeElement is called from setTimeout", () => {
  const element = document.createElement("div");
  const id = "myElement";
  element.id = id;
  element.classList.add("expand");
  document.body.append(element);

  let { collapse, removeElement } = domViews({});
  removeElement = jest.fn();
  jest.useFakeTimers();
  collapse(id);
  jest.runAllTimers();
  expect(removeElement).toHaveBeenCalledTimes(1);
  jest.useRealTimers();
});
