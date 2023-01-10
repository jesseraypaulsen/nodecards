import { createMachine, assign, sendParent } from "xstate";
import { send } from "xstate/lib/actions";

export const cardMachine = ({
  id,
  text = "",
  label = id,
  canvasPosition,
  domPosition,
}) =>
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
          domPosition: ({ id }, { domPosition }) => {
            return domPosition;
          },
        }),
      },
      setCanvasPosition: {
        actions: assign({
          canvasPosition: ({ id }, { canvasPosition }) => {
            return canvasPosition;
          },
        }),
      },
    },
    states: {
      active: {
        initial: "reading",
        entry: send(({ domPosition }) => ({
          type: "cardActivated",
          //x: domPosition.x,
          //y: domPosition.y,
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
              READ: { target: "reading" }, // this transition can occur if appMachine is in 'readOnly' or 'modifiable'.
              TYPING: {
                actions: [assign({ text: (context, event) => event.text })],
              },
            },
          },
        },
        on: {
          BRANCH: {
            actions: sendParent((context, event) => ({
              type: "BRANCHBUTTON.CLICK",
              load: context,
            })),
          },
          INERTIFY: {
            target: "inert",
          },
          DESTROY: {},
        },
      },
      inert: {
        // a nodecard can be inert when the app is in any of the modes. if the app is disabled, then all nodecard's become inert.
        /*entry: send(() => ({
          type: "cardDeactivated",
        })),*/
        on: {
          activate: { target: "active" },
        },
      },
    },
  });
