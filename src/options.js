export const options = {
  nodes: {
    font: {
      color: "#ffffff",
      size: 11
    },
    widthConstraint: { maximum: 70 },
    shape: "box",
    shadow: true,
    color: "#b3a5f7",
    borderWidth: 0,
    chosen: false
  },
  physics: {
    enabled: false,
  },
  interaction: {
    dragView: true,
    zoomView: true,
    selectConnectedEdges: false
  },
  edges: {
    width: 0.5,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: .5
      }
    }
  }
};

/*const options = { 
  nodes: { 
    scaling: { 
      label: { 
        min: 5, //min/max required to make scaling w/ labels work
        max: 40, 
        enabled: true 
      } 
    },
    shape: 'box',
    shadow: true
  },
  physics: {
    enabled: true
  } 
};*/
