import { qs } from "./dom-helpers";

export const synchPanel = (event) => {
  //like "controlled components", their internal state should be in sync with app state

  if (event.type === "turnPhysicsOff" && !event.sentByUser) {
    //not sent by user! change toggler to reflect the state!
    qs(".physics").firstElementChild.checked = false;
  }

  if (event.type === "APP.DISABLE" && !event.sentByUser) {
    //not sent by user! change value of select element to reflect the state!
    qs(".appMode").firstElementChild.checked = false;
  }
};