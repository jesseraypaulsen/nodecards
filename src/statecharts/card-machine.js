import { createMachine, assign, sendParent } from 'xstate';
import { send } from 'xstate/lib/actions';

export const cardMachine = ({id,text,label}) => createMachine({
  predictableActionArguments: true,
  id: 'nodecard',
  initial: 'inert',
  context: {
    id,
    label,
    text
  },
  states: {
    active: {
      initial: 'read',
      entry: [(_,e) => console.log(e), send((_, { x, y }) => ({ type: "cardActivated", x, y }))],
      states: {
        read: {
          on: {
            "SWITCH.EDIT": {
              target: "edit"
            }
          }
        },
        edit: {
          on: {
            "SWITCH.READ": { target: 'read' }, // this transition can occur if appMachine is in 'readOnly' or 'modifiable'.
            TYPING: { 
              actions: [
                assign({ text: (context, event) => event.text }),
                sendParent((context, event) => ({ type: "CARD.PERSIST", load: context }))
              ]
            }
          }
        }
      },
      on: {
        BRANCH: {
          actions: sendParent((context, event) => ({ type: "BRANCHBUTTON.CLICK", load: context }))
        },
        INERTIFY: {
          target: 'inert'
        },
        DELETE: {}
      }
    },
    inert: { // a nodecard can be inert when the app is in any of the modes. if the app is disabled, then all nodecard's become inert.
      on: {
        OPEN: { target: 'active' }
      }
    }
  }
})
