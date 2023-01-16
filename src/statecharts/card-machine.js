import { createMachine, assign, sendParent } from "xstate";
import { send } from "xstate/lib/actions";

export const cardMachine = ({ id, text, label, canvasPosition, domPosition }) =>
  createMachine({
    predictableActionArguments: true,
    id: "nodecard",
    initial: "inert",
    context: {
      id,
      label,
      text,
      canvasPosition,
      domPosition,
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
      active: {
        initial: "reading",
        entry: send(() => ({
          type: "cardActivated",
        })),
        exit: send(() => ({
          type: "cardDeactivated",
        })),
        states: {
          reading: {
            on: {
              EDIT: {
                target: "editing",
              },
            },
          },
          editing: {
            on: {
              READ: { target: "reading" },
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
      inert: {
        on: {
          activate: { target: "active" },
        },
      },
    },
  });
