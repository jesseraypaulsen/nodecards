import { createMachine, assign } from "xstate";

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
          actions: assign({
            domPosition: (_, { domPosition }) => {
              return domPosition;
            },
          }),
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
            activate: { target: "active" },
          },
        },
        active: {
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
          },
          on: {
            INERTIFY: {
              target: "inert",
            },
            DESTROY: {},
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
