export const options = {
  nodes: {
    font: {
      size: 10,
    },
    shape: "box",
    shadow: true,
    //color: "#D6D7E8",
    //color: "#D2E5FF",
    color: "#37c0fb",
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
