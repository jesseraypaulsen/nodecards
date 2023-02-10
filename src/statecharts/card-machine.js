import { createMachine, assign, send } from "xstate";

export const cardMachine = ({
  id,
  text,
  label,
  canvasPosition,
  domPosition,
  startInert,
}) =>
  createMachine(
    {
      predictableActionArguments: true,
      id: "nodecard",
      initial: "deciding",
      context: {
        id,
        label,
        text,
        canvasPosition,
        domPosition,
        startInert,
      },
      on: {
        setDOMPosition: {
          actions: [
            assign({
              domPosition: (_, { domPosition }) => {
                return domPosition;
              },
            }),
            send("__move__"),
          ],
        },
        setCanvasPosition: {
          actions: assign({
            canvasPosition: (_, { canvasPosition }) => {
              return canvasPosition;
            },
          }),
        },
      },
      states: {
        deciding: {
          always: [
            { target: "inert", cond: "startInert" },
            { target: "active", cond: "startActive" },
          ],
        },
        inert: {
          on: {
            __activate__: { target: "active.hist" },
          },
        },
        active: {
          //the delay is required for user-created cards because the card machine is created before the nodecard instance,
          //and unlike hydrated cards, user-created cards are active right away.
          entry: send({ type: "activate" }, { delay: 10 }),
          initial: "unlocked",
          states: {
            locked: {
              on: {
                UNLOCK: {
                  target: "unlocked",
                },
              },
            },
            unlocked: {
              on: {
                LOCK: {
                  target: "locked",
                },
                TYPING: {
                  actions: [assign({ text: (_, event) => event.data.text })],
                },
              },
            },
            hist: {
              type: "history",
            },
          },
          on: {
            INERTIFY: {
              target: "inert",
            },
            DESTROY: {},
            __move__: {
              actions: send("MOVE"),
            },
          },
        },
      },
    },
    {
      guards: {
        startInert: (context) => context.startInert,
        startActive: (context) => !context.startInert,
      },
    }
  );
