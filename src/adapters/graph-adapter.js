import Wrappers from '../controllers/library-wrappers'
import { graphController } from '../controllers/graph.controllers';
import { generateId, findEventType } from "../utils";
import { options } from "../options";
import * as vis from "vis-network";


export default function graphAdapterFactoryFactory(container) {

  const network = new vis.Network(container, {}, options);

  const a = (getId, getLabel, getCanvasPosition) => {
    const createNode = () => {
      network.body.data.nodes.add({ id: getId(), label: getLabel() });
    };
    
    const createNodeWithKnownPosition = () => {
      const { x, y } = getCanvasPosition();
      network.body.data.nodes.add({ id: getId(), label: getLabel(), x, y });
    };
    
    const removeNode = () => {
      network.body.data.nodes.remove(getId());
    };
    
    const moveNode = () => {
      const { x, y } = getCanvasPosition();
      network.moveNode(getId(), x, y);
    };
    
    // TODO: find out if this is necessary or not
    const updateNode = (id) => {
      const label = "";
      const options = {
        id,
        label,
        shape: "box",
        shadow: true,
        opacity: 1,
      };
      
      network.body.data.nodes.update(options);
    };
    
    return {
      createNode,
      createNodeWithKnownPosition,
      removeNode,
      moveNode,
      updateNode,
    };
  };
  
  const b = {
    createEdge(argsObject) {
      network.body.data.edges.add(argsObject);
      return argsObject;
    },
    removeEdge(id) {
      network.body.data.edges.remove(id);
    }
  }

  const c = (send) => Wrappers(network, send)

 
  const d = (send, canvasToDOM, calculatePositionThenCreate) => {



    const sendPositions = (id, canvasPosition, domPosition) => {
      send({ 
        type: "setCardDOMPosition", 
        id, 
        domPosition });
    
      send({
        type: "setCardCanvasPosition",
        id,
        canvasPosition,
      });
    };

    const synchDOMWithGraph = () => {
      const canvasPositions = network.getPositions();
      const ids = Object.keys(canvasPositions);
      ids.forEach((id) => {
        const canvasPosition = canvasPositions[id];
        //const domPosition = network.canvasToDOM(canvasPosition);
        const domPosition = canvasToDOM(canvasPosition);
    
        sendPositions(id, canvasPosition, domPosition);
      });
    };
    
    
    const scaleActiveCards = (e) => {
      const rootStyle = document.querySelector(":root");
      rootStyle.style.setProperty("--zoom-scale", e.scale);
      document.querySelectorAll(".nodecard").forEach((el) => {
        el.style.transform = `scale(${e.scale})`;
      });
    };
    
    network.on("zoom", (e) => {
      synchDOMWithGraph();
      scaleActiveCards(e);
    });
    
    //TODO, not working
    //https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
    // visualViewport.onresize = e => {
    //   synchDOMWithGraph()
    //   console.log('synchDOMWithGraph called')
    // }
    
    network.on("resize", (e) => {
      setTimeout(() => synchDOMWithGraph(), 100);
    });
    
    network.on("dragging", (e) => {
      if (e.nodes[0]) {
        sendPositions(e.nodes[0], e.pointer.canvas, e.pointer.DOM);
      } else {
        // dragging view
        synchDOMWithGraph();
      }
    });
    
    network.on("stabilized", (e) => {
      synchDOMWithGraph();
    });
    
    network.on("doubleClick", (e) => {
      if (findEventType(e) === "background") {
        const id = generateId();
        const label = id;
        const text = "";
        const domPosition = e.pointer.DOM;
        calculatePositionThenCreate(id, label, text, domPosition);
      }
    });

    const _graphController = graphController(send);
    network.on("click", _graphController);
    
  }
  
  
  return { a, b, c, d } 
}
