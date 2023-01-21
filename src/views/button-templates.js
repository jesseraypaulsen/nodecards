// http://fonts.google.com/icons
import dragIcon from "../../assets/icons/drag_indicator_FILL0_wght200_GRAD0_opsz24.png";
import deleteIcon from "../../assets/icons/delete_forever_FILL0_wght200_GRAD0_opsz24.png";
import inertifyIcon from "../../assets/icons/swipe_down_alt_FILL0_wght200_GRAD0_opsz24.png";
import branchIcon from "../../assets/icons/fork_right_FILL0_wght200_GRAD0_opsz24.png";
import lockIcon from "../../assets/icons/lock_FILL1_wght200_GRAD0_opsz24.png";
import lockOpenIcon from "../../assets/icons/lock_open_FILL0_wght200_GRAD0_opsz24.png";

export default (controllers, id) => {
  const eventType = "click";
  const classNames = ["button"];

  return {
    branch: {
      icon: branchIcon,
      handler: (e) => controllers.branch(id),
      eventType,
      classNames,
      active: true,
    },
    drag: {
      icon: dragIcon,
      handler: (e) => controllers.drag(e, id),
      eventType: "mousedown",
      classNames: [...classNames, "drag"],
      active: true,
    },
    unlock: {
      icon: lockIcon,
      handler: (e) => controllers.unlock(id),
      eventType,
      classNames,
      active: true,
    },
    lock: {
      icon: lockOpenIcon,
      handler: (e) => controllers.lock(id),
      eventType,
      classNames,
      active: true,
    },
    discard: {
      icon: deleteIcon,
      handler: (e) => controllers.delete(id),
      eventType,
      classNames,
      active: true,
    },
    inertify: {
      icon: inertifyIcon,
      handler: (e) => controllers.inertify(id),
      eventType,
      classNames,
      active: true,
    },
  };
};
