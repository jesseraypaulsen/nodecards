export const qs = (sel) => document.querySelector(sel)

export const render = (el, container) => { 
  if (!container) container = qs('#container');
  container.append(el)
}

export const div = (...args) => {
  const el = document.createElement("div");
  el.classList.add(...args)
  return el;
}