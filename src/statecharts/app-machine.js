import { createMachine, assign, spawn, send } from "xstate";
import { cardMachine } from "./card-machine";

export const appMachine = createMachine(
  {
    predictableActionArguments: true,
    id: "app",
    type: "parallel",
    context: {
      cards: [],
      links: [],
      active: [],
    },
    states: {
      mode: {
        initial: "initializing",
        states: {
          active: {
            on: {
              "CARD.CLICK": {
                actions: (context, { id, x, y }) => {
                  const card = context.cards.find((card) => id === card.id);
                  card.ref.send({ type: "OPEN", x, y });
                },
              },
              "CARD.INERTIFY": {
                actions: (context, event) => {
                  console.log("CARD.INERTIFY: ", event.id);
                  const card = context.cards.find(
                    (card) => event.id === card.id
                  );
                  card.ref.send({ type: "INERTIFY" });
                },
              },
              "CARD.READ": {
                actions: (context, event) => {
                  const card = context.cards.find(
                    (card) => event.id === card.id
                  );
                  card.ref.send({ type: "SWITCH.READ" });
                },
              },
            },
            entry: send({ type: "turnPhysicsOff", sentByUser: false }), // switch physics off when app is active
            states: {
              readOnly: {
                // popup buttons do not appear, each card's branch and edit buttons are disabled. 'edit' is not possible on cards.
              },
              modifiable: {
                initial: "regular",
                states: {
                  linkcreation: {
                    entry: {
                      // desktop: change behavior of mouse cursor;
                      // mobile: do something else
                    },
                    on: {
                      "BACKGROUND.CLICK": {
                        actions: [
                          // create nodecard + link;
                          // send transition for 'persisting' state.
                        ],
                      },
                      "NODECARD.CLICK": {
                        // works for both active and inert target cards;
                        // create link between cards
                        actions: [
                          send((context, event) => ({ type: "LINK.PERSIST" })),
                        ],
                      },
                    },
                  },
                  cardcreation: {
                    entry: send((_, { x, y }) => ({
                      type: "openPrompt",
                      x,
                      y,
                    })),
                    on: {
                      "CLICK.BACKGROUND": {
                        target: "regular",
                        actions: send({ type: "closePrompt" }),
                      },
                      "CLOSE.PROMPT": {
                        target: "regular",
                        actions: send({ type: "closePrompt" }),
                      },
                      CREATECARD: {
                        actions: "createNewCard",
                      },
                    },
                  },
                  regular: {
                    on: {
                      "BRANCHBUTTON.CLICK": { target: "linkcreation" },
                      "CLICK.BACKGROUND": { target: "cardcreation" },
                    },
                  },
                },
                on: {
                  "CLICK.EDGE": {
                    // popup button for deleting the edge
                  },
                  "CARD.EDIT": {
                    actions: send(
                      { type: "SWITCH.EDIT" },
                      { to: (_, e) => e.id }
                    ),
                  },
                  "CARD.EDIT.TYPING": {
                    actions: (context, { text, id }) => {
                      const card = context.cards.find((card) => id === card.id);
                      card.ref.send({ type: "TYPING", text, id });
                    },
                    // None of these work for using the "to" option when passing data thru the event. The docs have no explanation.
                    //send({ type: "TYPING", text: (_,e) => e.text }, { to: (context,event) => event.id})
                    //send((_,e) => ({ type: "TYPING", text: e.text }, { to: e.id }))
                    //send((_,e) => ({ type: "TYPING", text: e.text }), { to: (_,e) => e.id })
                  },
                  "CARD.DELETE": {
                    actions: [
                      (context, event) => {
                        const card = context.cards.find(
                          (card) => event.id === card.id
                        );
                        card.ref.send({ type: "DELETE" });
                        card.ref.stop();
                      },
                      assign({
                        cards: (context, event) =>
                          context.cards.filter((card) => event.id !== card.id),
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
              CREATECARD: {
                actions: "createNewCard",
              },
              CREATELINK: {
                actions: "createNewLink",
              },
              "INIT.COMPLETE": {
                actions: send("APP.READONLY"),
              },
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
        }, //transitions are placed on the 'mode' state instead of its child states, since any state can transition to any other.
        //otherwise you have to duplicate transitions for each state.
      },
      persisting: {
        initial: "disabled",
        states: {
          enabled: {
            "PERSIST.OFF": { target: "disabled" },
            "CARD.PERSIST": { actions: (context, event) => {} },
            "LINK.PERSIST": { actions: (context, event) => {} },
            "NEWCARD.PERSIST": { actions: (context, event) => {} },
          },
          disabled: {
            "PERSIST.ON": { target: "enabled" },
          },
        },
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
      createNewCard: assign({
        cards: (context, event) => {
          const { id, label, text } = event;
          return context.cards.concat({
            id,
            ref: spawn(cardMachine({ id, label, text }), {
              name: id,
              sync: true,
            }).onTransition((state) => {
              //console.log('child actor machine ->', 'state.value:', state.value, 'state.context:', state.context)
            }),
          });
        },
      }),
      createNewLink: assign({
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
    },
  }
);
