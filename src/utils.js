export function findEventType(params) {
  if (!params.nodes[0] && !params.edges[0]) {
    return "background";
  } else if (params.nodes[0]) {
    return "nodecard";
  } else if (params.edges[0]) {
    return "link";
  } else {
    return null;
  }
}

export const isValid = (o, action) =>
  Object.keys(o).find((key) => key === action);

export const generateId = () => Math.random().toString().substring(2, 12);
