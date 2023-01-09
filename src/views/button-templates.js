import dragIcon from "../../assets/icons/drag_indicator.png";
import deleteIcon from "../../assets/icons/delete_forever.png";
import editIcon from "../../assets/icons/edit.png";
import editOffIcon from "../../assets/icons/edit_off.png";
import linkIcon from "../../assets/icons/link.png";
import inertifyIcon from "../../assets/icons/swipe_down_alt.png";

export default (controllers, id, source, sendToMachine) => {
  // pass id into controller
  const wrapController = (e, controller) => {
    //const parent = e.target.parentElement.parentElement.parentElement;
    //controller(parent.id);
    controller(id);
  };

  const eventType = "click";
  const classNames = ["button"];

  return {
    drag: {
      icon: dragIcon,
      handler: (e) => drag(e),
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
