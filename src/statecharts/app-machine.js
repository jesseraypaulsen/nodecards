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
          //initial: "initializing",
          initial: "enabled",
          states: {
            enabled: {
              initial: "linkCreation_OFF",
              entry: send({ type: "turnPhysicsOff", sentByUser: false }),
              states: {
                linkCreation_ON: {
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
                      type: "highlightSourceCard",
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
                    //"createLink" event fired from cardCreation.ON after card is created
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
                      cond: 'isNotSourceCard' 
                      // expanded cards always send 'createLinkIfCreationIsOn' event when user interacts with them,
                      // including whenever you click on the link button. so this guard prevents the source card from linking to itself.
                    },
                    // the "createLink" event is both sent and received from within the same state
                    createLink: {
                      target: "linkCreation_OFF",
                    },
                    cancelLinkCreation: {
                      target: "linkCreation_OFF",
                      cond: 'isSourceCard'
                    },
                    // cancel link creation if the link button is clicked a second time on the source card
                    BRANCH: {
                      actions: [send((_, {from}) => ({type: 'cancelLinkCreation', from}))]
                    }
                  },
                },
                linkCreation_OFF: {
                  on: {
                    BRANCH: {
                      target: "linkCreation_ON",
                    },
                    activateCardIfLinkCreationIsOff: {
                      actions: [
                        (context, event) => {
                          context.cards
                            .find((card) => card.id === event.id)
                            .ref.send("__activate__");
                        },
                      ],
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
                __createCard__: {
                  actions: [
                    "createCard",
                    send((_, e) => ({
                      type: "createLinkIfLinkCreationIsOn",
                      to: e.id,
                    })),
                  ],
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
                2000: { target: "enabled" },
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
          //initial: 'disabled',
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
      guards: {
        isSourceCard: (context, event) => {
          return context.linkCreation.from == event.from
        },
        isNotSourceCard: (context, event) => {
          return context.linkCreation.from !== event.to
        }
      },
      actions: {
        createCard: assign({
          cards: (context, event) => {
            const { id, label, text, domPosition, canvasPosition, startInert = false } = event;
            return context.cards.concat({
              id,
              ref: spawn(
                cardMachine({
                  id,
                  text,
                  label,
                  domPosition,
                  canvasPosition,
                  startInert
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
            console.log(event)
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

  else if (event.type === "activate") {
    if (state.matches("active.unlocked")) {
      return "activateUnlocked";
    } else if (state.matches("active.locked")) {
      return "activateLocked";
    }
  }

  return event.type;
}
