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

export const processState = (state, event) => {
  let eventType, data;
  if (event.type === "xstate.update" && event.state.changed === undefined) {
    // "xstate.update" is triggered when new actor machines are spawned and when they are updated. It is enabled by the {sync: true} argument.
    //For spawning, state.changed evaluates to undefined. For some updates it evaluates to false, so testing for falsiness doesn't work here.
    data = event.state.context;
    if (state.matches("mode.initializing")) {
      eventType = "hydrateCard";
    } else if (state.matches("mode.active")) {
      eventType = "createCard";
    }
  } else {
    eventType = event.type;
    data = event;
  }
  return { eventType, data };
};
