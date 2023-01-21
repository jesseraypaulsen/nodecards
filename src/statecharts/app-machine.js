import { createMachine, assign, spawn, send, actions } from "xstate";
import { cardMachine } from "./card-machine";

const { log } = actions;

export const appMachine = (runChildEffect) =>
  createMachine(
    {
      predictableActionArguments: true,
      id: "app",
      type: "parallel",
      context: {
        cards: [],
        links: [],
        linkCreation: { id: null, label: null, from: null },
      },
      states: {
        mode: {
          initial: "initializing",
          states: {
            enabled: {
              entry: send({ type: "turnPhysicsOff", sentByUser: false }),
              type: "parallel",
              exit: send("closePrompt"),
              states: {
                linkCreation: {
                  initial: "OFF",
                  states: {
                    ON: {
                      entry: [
                        // desktop: change behavior of mouse cursor;
                        // mobile: do something else
                        assign({
                          linkCreation: (_, { linkId, label, from }) => ({
                            id: linkId,
                            label,
                            from,
                          }),
                        }),
                        send((_, { from }) => ({
                          type: "catchActiveCardEvent",
                          id: from,
                        })),
                      ],
                      exit: [
                        assign({
                          linkCreation: () => ({
                            id: null,
                            label: null,
                            from: null,
                          }),
                        }),
                      ],
                      on: {
                        //"creatLink" event fired from cardCreation.ON after card is created
                        createLinkIfLinkCreationIsOn: {
                          actions: [
                            assign({
                              links: ({ links, linkCreation }, { to }) => {
                                const { id, label, from } = linkCreation;
                                return [
                                  ...links,
                                  {
                                    id,
                                    label,
                                    from,
                                    to,
                                  },
                                ];
                              },
                            }),
                            send(({ linkCreation }, { to }) => ({
                              type: "createLink",
                              id: linkCreation.id,
                              label: linkCreation.label,
                              from: linkCreation.from,
                              to,
                            })),
                          ],
                        },
                        // the "createLink" event is both sent and received from within the same state
                        createLink: {
                          target: "OFF",
                        },
                        cancelLinkCreation: {
                          target: "OFF",
                        },
                      },
                    },
                    OFF: {
                      on: {
                        BRANCH: {
                          target: "ON",
                        },
                        activateCardIfLinkCreationIsOff: {
                          actions: [
                            (context, event) => {
                              context.cards
                                .find((card) => card.id === event.id)
                                .ref.send("activate");
                            },
                          ],
                        },
                      },
                    },
                  },
                },
                cardCreation: {
                  initial: "OFF",
                  states: {
                    ON: {
                      entry: send((_, { x, y }) => ({
                        type: "openPrompt",
                        x,
                        y,
                      })),
                      on: {
                        clickedBackground: {
                          target: "OFF",
                          actions: send({ type: "closePrompt" }),
                        },
                        "CLOSE.PROMPT": {
                          target: "OFF",
                          actions: send({ type: "closePrompt" }),
                        },
                        __createCard__: {
                          actions: [
                            "createCard",
                            send({ type: "CLOSE.PROMPT" }),
                            send((_, e) => ({
                              type: "createLinkIfLinkCreationIsOn",
                              to: e.id,
                            })),
                          ],
                        },
                      },
                    },
                    OFF: {
                      on: {
                        clickedBackground: {
                          target: "ON",
                        },
                      },
                    },
                  },
                },
              },
              on: {
                mediate: {
                  actions: (context, { childType, data }) => {
                    const card = context.cards.find(
                      (card) => data.id === card.id
                    );
                    card.ref.send({ type: childType, data });
                  },
                },
                decidePath: {
                  actions: [
                    send((_, { id }) => ({
                      type: "activateCardIfLinkCreationIsOff",
                      id,
                    })),
                    send((_, { id }) => ({
                      type: "createLinkIfLinkCreationIsOn",
                      to: id,
                    })),
                  ],
                },
                destroyCard: {
                  actions: [
                    (context, event) => {
                      const card = context.cards.find(
                        (card) => event.id === card.id
                      );
                      card.ref.send({ type: "DESTROY" });
                      card.ref.stop();
                    },
                    assign({
                      cards: (context, event) =>
                        context.cards.filter((card) => event.id !== card.id),
                    }),
                    assign({
                      links: (context, event) => {
                        let linksToKeep = [...context.links];
                        for (let i = 0; i < context.links.length; i++) {
                          for (let j = 0; j < event.links.length; j++) {
                            if (context.links[i].id === event.links[j].id) {
                              linksToKeep = linksToKeep.filter(
                                (link) => context.links[i].id !== link.id
                              );
                            }
                          }
                        }
                        return linksToKeep;
                      },
                    }),
                  ],
                  //How to remove the spawned machine from the parent's children property? Maybe it's unnecessary?
                  // The question remains unanswered: https://stackoverflow.com/q/61013927
                },
                destroyLink: {
                  actions: [
                    assign((context, { id }) => ({
                      links: [
                        ...context.links.filter((link) => link.id !== id),
                      ],
                    })),
                  ],
                },
                openLinkPrompt: {},
              },
            },
            initializing: {
              on: {
                __hydrateCard__: {
                  actions: ["hydrateCard"],
                },
                hydrateLink: {
                  actions: "hydrateLink",
                },
              },
              after: {
                1000: { target: "enabled" },
              },
            },
            disabled: {
              entry: (context) => {
                context.cards.forEach((card) => {
                  card.ref.send("INERTIFY");
                });
              },
            },
          },
          on: {
            "APP.ENABLE": { target: "mode.enabled" },
            "APP.DISABLE": { target: "mode.disabled" },
            setCardDOMPosition: { actions: "setCardDOMPosition" },
            setCardCanvasPosition: { actions: "setCardCanvasPosition" },
          }, //APP.* transitions are placed on the 'mode' state instead of its child states, since any state can transition to any other.
          //otherwise you have to duplicate transitions for each state.
        },
        physics: {
          initial: "initializing",
          states: {
            initializing: {
              on: {
                turnPhysicsOff: { target: "disabled" },
              },
            },
            enabled: {
              on: {
                turnPhysicsOff: { target: "disabled" },
              },
              entry: send({ type: "APP.DISABLE", sentByUser: false }),
            },
            disabled: {
              on: {
                turnPhysicsOn: { target: "enabled" },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        createCard: assign({
          cards: (context, event) => {
            const { id, label, text, domPosition, canvasPosition } = event;
            return context.cards.concat({
              id,
              ref: spawn(
                cardMachine({
                  id,
                  text,
                  label,
                  domPosition,
                  canvasPosition,
                  startInert: false,
                }),
                {
                  name: id,
                  sync: true,
                }
              ).onTransition((state, event) => {
                runRunChildEffect(runChildEffect, state, event);
              }),
            });
          },
        }),
        hydrateCard: assign({
          cards: (context, event) => {
            const { id, label, text } = event;
            return context.cards.concat({
              id,
              ref: spawn(
                cardMachine({
                  id,
                  label,
                  text,
                  startInert: true,
                }),
                {
                  name: id,
                  sync: true,
                }
              ).onTransition((state, event) => {
                runRunChildEffect(runChildEffect, state, event);
              }),
            });
          },
        }),
        hydrateLink: assign({
          links: (context, event) => {
            const { id, label, from, to } = event;
            return context.links.concat({
              id,
              label,
              from,
              to,
            });
          },
        }),
        setCardCanvasPosition: ({ cards }, { id, canvasPosition }) => {
          const card = cards.find((card) => id === card.id);
          card.ref.send({
            type: "setCanvasPosition",
            canvasPosition,
          });
        },
        setCardDOMPosition: ({ cards }, { id, domPosition }) => {
          const card = cards.find((card) => id === card.id);
          card.ref.send({
            type: "setDOMPosition",
            domPosition,
          });
        },
      },
    }
  );

// for the onTransition method for cards spawned by the hydrateCard and createCard actions
function runRunChildEffect(runChildEffect, state, event) {
  const eventType = processChildState(state, event);
  const { id, text, domPosition, canvasPosition } = state.context;
  runChildEffect(eventType, {
    id,
    text,
    canvasPosition,
    domPosition,
  });
}

function processChildState(state, event) {
  // when the parent machine transitions to 'mode.disabled', prevent the inertify effect for cards that are already inert
  if (
    state.history &&
    state.history.value === "inert" &&
    state.matches("inert") &&
    event.type === "INERTIFY"
  )
    return;
  else return event.type;
}
