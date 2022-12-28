export const qs = (sel) => document.querySelector(sel);

export const render = (el, container) => {
  if (!container) container = qs("#container");
  container.append(el);
};

export const div = (...args) => {
  const el = document.createElement("div");
  el.classList.add(...args);
  return el;
};

export const span = (...args) => {
  const el = document.createElement("span");
  el.classList.add(...args);
  return el;
};

export const setPosition = (element, x, y) => {
  let width = parseInt(getComputedStyle(element).width.substring(0, 3));
  let height = parseInt(getComputedStyle(element).height.substring(0, 3));

  element.style.left = x - width / 2 + "px";
  element.style.top = y - height / 2 + "px";
};

/* Finds the center point of an element relative to its offsetParent property. */
export const centerPoint = (element) => {
  let centerX = element.offsetLeft + element.offsetWidth / 2;
  let centerY = element.offsetTop + element.offsetHeight / 2;
  return { domX: centerX, domY: centerY };
};
