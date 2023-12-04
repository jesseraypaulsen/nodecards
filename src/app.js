import { interpret } from "xstate";
import { appMachine } from "./statecharts/app-machine";
import Render from "./render";
import DeckManager from "./views/deck-manager";
import nodecard from "./views/nodecard";
import { domAdapterFactory } from "./views/nodecard.dom-adapter";
import { synchPanel } from "./views/synch-settings-panel"
import graphAdapterFactoryFactory from "./views/graph-adapter";
import nodecardControllers from "./controllers/nodecard.controllers";
import "../assets/styles/main.css";
import "../assets/styles/settings-panel.css";
import "../assets/styles/nodecard.css";
import "../assets/styles/icon-button.scss";
import "../assets/styles/tooltip.scss";
import "../assets/styles/prompt.css";
import data from "../data/vervaeke.json";
import { guidedTour } from "./guided-tour";

const container = document.querySelector("#container");

// when App mode is off, prevent context menu from opening when you click and hold a node
container.addEventListener('contextmenu', (e) => e.preventDefault())

const graphAdapterFactories = graphAdapterFactoryFactory(container);

const cardFace = nodecard(graphAdapterFactories.a, domAdapterFactory);

const { setupParentEffect, runChildEffect } = DeckManager(
  cardFace,
  graphAdapterFactories.b
);

const service = interpret(appMachine(runChildEffect));

const { calculatePositionThenCreate, hydrateCard, hydrateLink, hydratePositionedCard, canvasToDOM, peripheralEffects } = graphAdapterFactories.c(service.send);

graphAdapterFactories.d(service.send, canvasToDOM, calculatePositionThenCreate)

// highlight the card that the link originates from
const startHighlightingSourceCard = (id) => {
  const fromCard = Array.from(container.querySelectorAll(".nodecard")).find(el => el.dataset.id == id)
  fromCard.classList.add('linking-from')
}

// remove the highlight from the card that originated the link
const stopHighlightingSourceCard = (from) => {
  const fromCard = Array.from(container.querySelectorAll(".nodecard")).find(el => el.dataset.id == from)
  if (fromCard && fromCard.classList.contains('linking-from')) fromCard.classList.remove('linking-from')
}

const runParentEffect = setupParentEffect({
  controllers: nodecardControllers(container, service.send),
  startHighlightingSourceCard,
  stopHighlightingSourceCard
});

const { init, render } = Render(
  runParentEffect,
  synchPanel,
  hydrateCard,
  hydrateLink,
  peripheralEffects,
  hydratePositionedCard
);

// alias
const createPositionedCard = hydratePositionedCard;

// subscribe views
service.onTransition((state, event) => {
  if (state.event.type === "xstate.init") init(data);
  else render(state, event);
});

service.start();

guidedTour(service.send, createPositionedCard, canvasToDOM)
