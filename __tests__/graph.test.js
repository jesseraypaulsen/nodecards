import graphFaceFactory from "../src/views/graph";

describe("graphFace", () => {
  let graphFace, network;
  beforeEach(() => {
    network = {
      getPosition: jest.fn(() => ({ x: 100, y: 200 })),
      canvasToDOM: jest.fn(() => ({ x: 1, y: 2 })),
      moveNode: jest.fn(() => undefined),
      setOptions: jest.fn(() => undefined),
      body: {
        data: {
          nodes: {
            update: jest.fn(() => undefined),
            remove: jest.fn(() => undefined),
            add: jest.fn(() => undefined),
          },
          edges: {
            add: jest.fn(() => undefined),
          },
        },
      },
    };
    graphFace = graphFaceFactory(network);
  });

  it("createNode", () => {
    graphFace.createNode("fakeId");
    expect(network.body.data.nodes.add).toBeCalledTimes(1);
  });
  it("createEdge", () => {
    graphFace.createEdge("fakeId");
    expect(network.body.data.edges.add).toBeCalledTimes(1);
  });
  it("removeNode", () => {
    graphFace.removeNode("fakeId");
    expect(network.body.data.nodes.remove).toBeCalledTimes(1);
  });
  it("getNodeCenter", () => {
    graphFace.getNodeCenter("fakeId");
    expect(network.getPosition).toBeCalledTimes(1);
    expect(network.canvasToDOM).toBeCalledTimes(1);
  });
  it("moveNode", () => {
    graphFace.moveNode("fakeId");
    expect(network.moveNode).toBeCalledTimes(1);
  });
  it("updateNode", () => {
    graphFace.updateNode("fakeId");
    expect(network.body.data.nodes.update).toBeCalledTimes(1);
  });
  it("setPhysics", () => {
    graphFace.setPhysics({});
    expect(network.setOptions).toBeCalledTimes(1);
  });
});
