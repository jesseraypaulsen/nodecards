/*import domFaceFactory from "../src/views/nodecard.dom";
import * as helpers from "../src/views/dom-helpers"; // named exports

//https://jestjs.io/docs/jest-object
//https://jestjs.io/docs/mock-function-api
//https://jestjs.io/docs/expect
//https://jestjs.io/docs/asynchronous
// https://jestjs.io/docs/timer-mocks

describe("domFace", () => {

  const domFace = domFaceFactory();
  const collapseSpy = jest.spyOn(domFace, "collapse");
  const removeElementSpy = jest.spyOn(domFace, "removeElement");

  beforeEach(() => {
    collapseSpy.mockClear();
    removeElementSpy.mockClear();
  });

  describe("removeElement", () => {
    const originalQs = helpers.qs;

    beforeEach(() => {
      const el = document.createElement("div");
      el.classList.add("xyz");
      document.body.append(el);
      helpers.qs = jest.fn().mockReturnValue(el);
    });

    it("selects an element by class name and removes it from the DOM", () => {
      const executedMethod = views.removeElement(".xyz");
      expect(typeof views.removeElement).toBe("function");
      expect(executedMethod).toBeUndefined();
      expect(helpers.qs).toHaveBeenCalledTimes(1);
      expect(helpers.qs).toHaveBeenCalledWith(".xyz");
      const removed = originalQs(".xyz");
      expect(removed).toBeNull();
      helpers.qs.mockImplementation(originalQs);
    });

    it("will not remove the element if the dependency fails to retrieve it", () => {
      helpers.qs.mockImplementation(() => null);

      //expect(() => views.removeElement(".xyz")).toThrow(); // the error-producing code must be wrapped in a function for toThrow matcher
      //see nodecard.dom.js for the alternative implementation in comments, that works with this

      const executedMethod = views.removeElement(".xyz");
      expect(executedMethod instanceof Error).toBe(true);
      const removed = originalQs(".xyz");
      expect(removed).toBeDefined(); // the element was not removed
      helpers.qs.mockClear();
    });
  });

  describe("fillElement", () => {});
  describe("insertView", () => {});
  describe("insertBar", () => {});
  describe("chooseView", () => {});
  describe("updateEditor", () => {});
  describe("htmlText", () => {});
  describe("collapse", () => {
    const element = document.createElement("div");
    const id = "myElement";
    element.id = id;
    element.classList.add("expand");
    document.body.append(element);

    it('changes the class of the element from "expand" to "collapse"', () => {
      helpers.qs = jest.fn().mockReturnValue(element);
      expect(element.classList.contains("expand")).toBe(true);
      const result = views.collapse(id);
      expect(collapseSpy).toHaveBeenCalledWith(id);
      expect(collapseSpy).toHaveReturnedWith(undefined);
      expect(result).toBeUndefined();
      expect(helpers.qs).toHaveBeenCalledTimes(2);
      expect(element.classList.contains("collapse")).toBe(true);
      expect(element.classList.contains("expand")).toBe(false);
    });

    it("removes the element", () => {
      jest.useFakeTimers();

      //removeElementSpy.mockImplementation((id) => {
      //  console.log(id);
      //});

      // const callback = () => {
      //   console.log("done!");
      //   expect(removeElementSpy).toHaveBeenCalledTimes(1);
      //   expect(removeElementSpy).toHaveBeenCalledWith(id);
      //   done();
      // };

      const callback = jest.fn(() => console.log("callback called"));
      views.collapse(id, callback);
      expect(collapseSpy).toHaveBeenCalledTimes(1);
      jest.runAllTimers();
      //expect(removeElementSpy).toHaveBeenCalledTimes(1); //FAIL!!!
      expect(callback).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });
});

const insideTimeout = (func) => {
  setTimeout(() => {
    func();
  }, 500);
};
test("reduced test case for the collapse method", () => {
  jest.useFakeTimers();
  const func = jest.fn(() => console.log("func called"));
  insideTimeout(func);
  expect(func).toHaveBeenCalledTimes(0);
  jest.runAllTimers();
  expect(func).toHaveBeenCalledTimes(1);
  jest.useRealTimers();
});*/

test("Sanity check", () => {
  expect(true).toBe(true);
});

/*
const func2 = () => console.log('func2 called')
const insideTimeout2 = () => {
  setTimeout(() => {
    func2()
  }, 500)
}

test("second reduced test case for the collapse method", () => {
  jest.useFakeTimers();

  jest.useRealTimers();
})
*/

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
