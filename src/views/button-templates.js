// http://fonts.google.com/icons
import dragIcon from "../../assets/icons/drag_indicator_FILL0_wght200_GRAD0_opsz24.png";
import editIcon from "../../assets/icons/edit_FILL0_wght200_GRAD0_opsz24.png";
import editOffIcon from "../../assets/icons/edit_off_FILL0_wght200_GRAD0_opsz24.png";
import linkIcon from "../../assets/icons/link_FILL0_wght200_GRAD0_opsz24.png";
import deleteIcon from "../../assets/icons/delete_forever_FILL0_wght200_GRAD0_opsz24.png";
import inertifyIcon from "../../assets/icons/swipe_down_alt_FILL0_wght200_GRAD0_opsz24.png";
import branchIcon from "../../assets/icons/fork_right_FILL0_wght200_GRAD0_opsz24.png";

export default (controllers, id, source) => {
  // pass id into controller
  const wrapController = (e, controller) => {
    //const parent = e.target.parentElement.parentElement.parentElement;
    //controller(parent.id);
    controller(id);
  };

  const eventType = "click";
  const classNames = ["button"];

  return {
    branch: {
      icon: branchIcon,
      handler: (e) => wrapController(e, controllers.branch),
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
      handler: (e) => wrapController(e, controllers.edit),
      eventType,
      classNames,
      active: true,
    },
    read: {
      icon: editOffIcon,
      handler: (e) => wrapController(e, controllers.read),
      eventType,
      classNames,
      active: true,
    },
    discard: {
      icon: deleteIcon,
      handler: (e) => wrapController(e, controllers.delete),
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
      handler: (e) => wrapController(e, controllers.inertify),
      eventType,
      classNames,
      active: true,
    },
  };
};
