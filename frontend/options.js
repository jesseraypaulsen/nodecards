export const options = {
  nodes: {
    font: {
      size: 14,
      color: "#ffffff",
    },
    shape: "box",
    shadow: true,
    color: "#6002EE",
  },
  physics: {
    enabled: true,
  },
  interaction: {
    dragView: false, //!!important for keeping nodecards in sync with canvas nodes!!
    zoomView: false, //!!important for the same reason above!!
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
