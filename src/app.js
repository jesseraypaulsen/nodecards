import { interpret } from "xstate";
import { appMachine } from "./statecharts/app-machine";
import Render from "./render";
import DeckManager from "./views/deck-manager";
import nodecard from "./views/nodecard";
import { domAdapterFactory } from "./adapters/nodecard.dom-adapter";
import { synchPanel } from "./views/synch-settings-panel"
import graphAdapterFactoryFactory from "./adapters/graph-adapter";
import nodecardControllers from "./controllers/nodecard.controllers";
import { stopHighlightingSourceCard, startHighlightingSourceCard } from "./views/highlight-source-card";
import "../assets/styles/main.css";
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

const { hydrateCard, hydrateLink, calculatePositionThenCreate, hydratePositionedCard, canvasToDOM, peripheralEffects } = graphAdapterFactories.c(service.send);

graphAdapterFactories.d(service.send, canvasToDOM, calculatePositionThenCreate)


const controllers = nodecardControllers(container, service.send)

const runParentEffect = setupParentEffect({
  controllers,
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
