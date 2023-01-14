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
        linkCreation: { active: false, from: null, to: null },
      },
      states: {
        mode: {
          initial: "initializing",
          states: {
            active: {
              on: {
                mediate: {
                  actions: (context, { id, childType }) => {
                    const card = context.cards.find((card) => id === card.id);
                    card.ref.send({ type: childType });
                  },
                },
              },
              entry: send({ type: "turnPhysicsOff", sentByUser: false }), // switch physics off when app is active
              states: {
                readOnly: {},
                modifiable: {
                  type: "parallel",
                  states: {
                    linkCreation: {
                      initial: "OFF",

                      on: {
                        "NODECARD.CLICK": {
                          // works for both active and inert target cards;
                          // create link between cards
                          actions: [],
                        },
                      },
                      states: {
                        ON: {
                          entry: [
                            // desktop: change behavior of mouse cursor;
                            // mobile: do something else
                            log(
                              (context, e) =>
                                `linkCreation -> ${Object.keys(e)}`
                            ),
                            assign({
                              linkCreation: (context, event) => ({
                                active: true,
                                from: event.from,
                                to: null,
                              }),
                            }),
                          ],
                          exit: [
                            log(
                              (context) =>
                                `linkCreation: self-transition (event: createLink) ${context.linkCreation.from}`
                            ),
                            assign({
                              linkCreation: () => ({
                                active: false,
                                from: null,
                                to: null,
                              }),
                            }),
                          ],
                          on: {
                            //event triggered from within cardCreation.ON after card is created
                            createLinkIfLinkCreationIsOn: {
                              actions: [
                                log(
                                  (context, e) =>
                                    `createLinkIfLinkCreationIsOn!!!!! ${Object.keys(
                                      e
                                    )}`
                                ),
                                assign({
                                  linkCreation: (context, event) => ({
                                    ...context.linkCreation,
                                    to: event.to,
                                  }),
                                }),
                                send(({ linkCreation }) => ({
                                  type: "createLink",
                                  from: linkCreation.from,
                                  to: linkCreation.to,
                                })),
                              ],
                            },
                            // the "createLink" event is both sent and received from within the same state
                            createLink: {
                              target: "OFF",
                            },
                          },
                        },
                        OFF: {
                          on: {
                            BRANCH: {
                              target: "ON",
                              actions: log(
                                (_, { from }) => `BRANCH from ${from}`
                              ),
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
                                  //type: "__setDataForLinkCreation__",
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
                    mediateToModify: {
                      actions: (context, { childType, data }) => {
                        const card = context.cards.find(
                          (card) => data.id === card.id
                        );
                        card.ref.send({ type: childType, data });
                      },
                    },
                    "CLICK.EDGE": {
                      // popup button for deleting the edge
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
                            context.cards.filter(
                              (card) => event.id !== card.id
                            ),
                        }),
                      ],
                      //How to remove the spawned machine from the parent's children property? Maybe it's unnecessary?
                      // The question remains unanswered: https://stackoverflow.com/q/61013927
                    },
                  },
                },
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
                //"INIT.COMPLETE": { target: "active.readOnly" },
              },
              after: {
                1000: { target: "active.modifiable" },
              },
            },
            disabled: {
              // in this state, all Nodecards functionality is disabled, leaving just the naked graph renderer.
              entry: (context, event) => {
                context.cards.forEach((card) => {
                  card.ref.send("INERTIFY");
                });
              },
            },
          },
          on: {
            "APP.READONLY": { target: "mode.active.readOnly" },
            "APP.MODIFIABLE": { target: "mode.active.modifiable" },
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
        persisting: {
          initial: "disabled",
          states: {
            enabled: {
              "PERSIST.OFF": { target: "disabled" },
            },
            disabled: {
              "PERSIST.ON": { target: "enabled" },
            },
          },
        },
      },
    },
    {
      actions: {
        createCard: assign({
          //TODO: remove position, change name to createCard
          cards: (context, event) => {
            const { id, label, text, domPosition, canvasPosition } = event;
            return context.cards.concat({
              id,
              ref: spawn(
                cardMachine({ id, text, label, domPosition, canvasPosition }),
                {
                  name: id,
                  sync: true,
                }
              ).onTransition((state, event) => {
                const { id, text, domPosition, canvasPosition } = state.context;

                runChildEffect(event.type, {
                  id,
                  text,
                  domPosition,
                  canvasPosition,
                });
              }),
            });
          },
        }),
        hydrateCard: assign({
          cards: (context, event) => {
            const { id, label, text } = event;
            return context.cards.concat({
              id,
              ref: spawn(cardMachine({ id, label, text }), {
                name: id,
                sync: true,
              }).onTransition((state, event) => {
                if (event.type !== "xstate.init") {
                  const { id, text, domPosition, canvasPosition } =
                    state.context;

                  runChildEffect(event.type, {
                    id,
                    text,
                    canvasPosition,
                    domPosition,
                  });
                }
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
