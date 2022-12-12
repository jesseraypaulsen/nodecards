jest.mock("../src/views/nodecard.dom", () =>
  jest.fn(() => ({
    removeElement: jest.fn(() => undefined),
    collapse: jest.fn(() => undefined),
    fillElement: jest.fn(() => undefined),
    updateEditor: jest.fn(() => undefined),
  }))
);
jest.mock("../src/views/graph", () =>
  jest.fn(() => ({
    removeNode: jest.fn(() => undefined),
  }))
);

import domFaceFactory from "../src/views/nodecard.dom";
import graphFaceFactory from "../src/views/graph";
import activeFaceFactory from "../src/views/nodecard.active";

describe("activeFace", () => {
  let domFace, graphFace, activeFace;
  beforeEach(() => {
    domFace = domFaceFactory();
    graphFace = graphFaceFactory();
    activeFace = activeFaceFactory(domFace, graphFace);
  });
  test("activeFace.discard() calls domFace.removeElement() and graphFace.removeNode()", () => {
    activeFace.discard("fakeId");
    expect(domFace.removeElement).toHaveBeenCalled();
    expect(graphFace.removeNode).toHaveBeenCalled();
  });
  test("activeFace.inertify() calls domFace.collapse()", () => {
    activeFace.inertify();
    expect(domFace.collapse).toHaveBeenCalledTimes(1);
  });
});
