export const options = {
  nodes: {
    font: {
      color: "#ffffff",
      size: 12
    },
    widthConstraint: { maximum: 70 },
    shape: "box",
    shadow: true,
    color: "#b3a5f7",
  },
  physics: {
    enabled: false,
  },
  interaction: {
    dragView: true,
    zoomView: true,
    selectConnectedEdges: false
  },
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
