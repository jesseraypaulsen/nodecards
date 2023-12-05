import peripheralControllers from "./peripheral-controllers";
import promptViews from "../views/prompt";
//import { settingsPanel, synchPanel } from "../views/settings-panel";
import { settingsPanel } from "../views/settings-panel";


export default (network, send) => {
  // vis-network adapters

  const canvasToDOM = (canvasPosition) => network.canvasToDOM(canvasPosition);
  const DOMtoCanvas = (domPosition) => network.DOMtoCanvas(domPosition);
  const getCanvasPosition = (id) => network.getPosition(id);

  // XState adapters

  const setCanvasPosition = ({ canvasPosition, ...args }) =>
    send({ type: "setCardCanvasPosition", canvasPosition, ...args });

  const setDOMPosition = ({ domPosition, ...args }) => {
    send({ type: "setCardDOMPosition", domPosition, ...args });
  };

  const createCard = ({ ...args }) => {
    send({ type: "__createCard__", ...args });
  };

  const hydrateCard = ({ ...args }) =>
    send({ type: "__hydrateCard__", ...args });

  const hydrateLink = ({ ...args }) => send({ type: "hydrateLink", ...args });

  //const removeLink = ({ ...args }) => send({ type: "removeLink", ...args });

  // facades

  /*
  No longer necessary. The 'stabilized' event is used instead.
  const setPositionAfterCreation = (id, delay) => {
    // delay until after the machine transitions from mode.intializing to mode.active, so that physics engine is turned off.
    // otherwise the position data will not be accurate.
    setTimeout(() => {
      let canvasPosition = getCanvasPosition(id);
      let domPosition = canvasToDOM({
        x: canvasPosition.x,
        y: canvasPosition.y,
      });
      setDOMPosition({ domPosition, id });
      setCanvasPosition({ canvasPosition, id });
    }, delay);
  };
  */

  const calculatePositionThenCreate = (id, label, text, domPosition) => {
    const canvasPosition = DOMtoCanvas({
      x: domPosition.x,
      y: domPosition.y,
    });
    createCard({
      label,
      text,
      domPosition,
      canvasPosition,
      id,
    });
  };



  const hydratePositionedCard = ({ id, label, text, x, y, startInert = true }) => {
    const canvasPosition = {x, y}
    const domPosition = canvasToDOM({ x, y })
    createCard({
      label,
      text,
      domPosition,
      canvasPosition,
      id,
      startInert
    })
  }

  const setPhysics = (value) => {
    const options = { physics: { enabled: value } };
    network.setOptions(options);
  };
  const { panelControllers, linkPromptController } = peripheralControllers(
    send
  );
  
  const openLinkPrompt = promptViews(linkPromptController);

  const peripheralEffects = {
    turnPhysicsOff: () => setPhysics(false),
    turnPhysicsOn: () => setPhysics(true),
    openLinkPrompt: (e) => openLinkPrompt(e),
  };

  settingsPanel(panelControllers);



  return {
    hydrateCard,
    hydrateLink,
    //removeLink,
    calculatePositionThenCreate,
    hydratePositionedCard,
    canvasToDOM,
    DOMtoCanvas,
    peripheralEffects
  };
};
