import {
  domFaceFactory,
  elementRemover,
  collapser,
} from "../src/views/nodecard.dom";
import * as helpers from "../src/views/dom-helpers"; // named exports

//https://jestjs.io/docs/jest-object
//https://jestjs.io/docs/mock-function-api
//https://jestjs.io/docs/expect
//https://jestjs.io/docs/asynchronous
// https://jestjs.io/docs/timer-mocks

describe("domFace", () => {
  describe("removeElement()", () => {
    const el = document.createElement("div");
    document.body.append(el);
    const injectedPrivate = { el };
    const partialDomFace = elementRemover(injectedPrivate);

    it("removes element from the DOM", () => {
      expect(typeof partialDomFace.removeElement).toBe("function");
      const result = partialDomFace.removeElement();
      expect(result).toBeUndefined();
      const removed = injectedPrivate.el;
      expect(removed).toBeUndefined();
    });
  });

  describe("expand()", () => {
    it("calls fillElement()", () => {
      const el = document.createElement("div");
      el.id = "container";
      document.body.append(el);
      const domFace = domFaceFactory();
      const fillElementSpy = jest.spyOn(domFace, "fillElement");
      domFace.expand({ x: 1, y: 1, view: {} });
      expect(fillElementSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("fillElement", () => {});
  describe("updateEditor", () => {});

  describe("collapse()", () => {
    it("calls removeElement from setTimeout", () => {
      jest.useFakeTimers();
      const domFace = domFaceFactory();
      const removeElementSpy = jest.spyOn(domFace, "removeElement");
      domFace.collapse();
      jest.runAllTimers();
      expect(removeElementSpy).toHaveBeenCalledWith();
      expect(removeElementSpy).toHaveReturnedWith(undefined);
      expect(removeElementSpy).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });

    it('changes the class of the element from "expand" to "collapse"', () => {
      const el = document.createElement("div");
      el.classList.add("expand");
      document.body.append(el);
      const injectedPrivate = { el };
      expect(injectedPrivate.el.classList.contains("expand")).toBe(true);
      const partialDomFace = collapser(injectedPrivate);
      const result = partialDomFace.collapse();
      expect(result).toBeUndefined();
      expect(injectedPrivate.el.classList.contains("collapse")).toBe(true);
      expect(injectedPrivate.el.classList.contains("expand")).toBe(false);
    });
  });
});

test("click", () => {
  document.body.innerHTML = `<div>
  <button id="btn" />
  </div>`;
  let status = false;
  const btn = document.querySelector("#btn");
  btn.addEventListener("click", () => {
    status = true;
  });

  btn.click();

  expect(status).toBe(true);
});
