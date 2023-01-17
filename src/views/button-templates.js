// http://fonts.google.com/icons
import dragIcon from "../../assets/icons/drag_indicator_FILL0_wght200_GRAD0_opsz24.png";
import editIcon from "../../assets/icons/edit_FILL0_wght200_GRAD0_opsz24.png";
import editOffIcon from "../../assets/icons/edit_off_FILL0_wght200_GRAD0_opsz24.png";
import linkIcon from "../../assets/icons/link_FILL0_wght200_GRAD0_opsz24.png";
import deleteIcon from "../../assets/icons/delete_forever_FILL0_wght200_GRAD0_opsz24.png";
import inertifyIcon from "../../assets/icons/swipe_down_alt_FILL0_wght200_GRAD0_opsz24.png";
import branchIcon from "../../assets/icons/fork_right_FILL0_wght200_GRAD0_opsz24.png";

export default (controllers, id, source) => {
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
    edit: {
      icon: editIcon,
      handler: (e) => controllers.edit(id),
      eventType,
      classNames,
      active: true,
    },
    read: {
      icon: editOffIcon,
      handler: (e) => controllers.read(id),
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
    source: {
      icon: linkIcon,
      handler: (e) => (source ? open(source, "_blank") : null),
      eventType,
      classNames,
      active: source ? true : false,
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
