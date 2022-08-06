export const setPhysics = (boolVal, deck) => {
  const options = deck.renderingOptions;
  if (typeof boolVal === "boolean") {
    options.physics.enabled = boolVal;
  }
  deck.net.setOptions(options);
};

export function typeofSelection(params) {
  if (!params.nodes[0] && !params.edges[0]) {
    // background
    return "BG";
  } else if (params.nodes[0]) {
    // nodecard
    return "NC";
  } else {
    return null;
  } // TODO: 'edge'
}

//used like this: <button onclick="toggle('edge-popup')">Link Posts</button>
function toggle(elementid) {
  // starts off as close -- see index.html
  let el = document.querySelector(`#${elementid}`);
  if (el.classList.contains("open")) {
    el.classList.remove("open");
    el.classList.add("close");
  } else if (el.classList.contains("close")) {
    el.classList.remove("close");
    el.classList.add("open");
  }
}
