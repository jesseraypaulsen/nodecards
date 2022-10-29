import { createMachine, assign, spawn, send, sendParent } from 'xstate';


const cardMachine = ({id,text,label}) => createMachine({
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
            "SWITCH.READ": { target: 'read' }, // this transition can occur if deckMachine is in 'readOnly' or 'modifiable'.
            TYPING: { 
              actions: [
                assign({ text: (_, event) => event.value }),
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
        }
      }
    },
    inert: { // a nodecard can be inert when the deck is any of the modes. if the deck is disabled, then all nodecard's become inert.
      on: {
        OPEN: { target: 'active' }
      }
    }
  }
})

export const deckMachine = createMachine({
  predictableActionArguments: true,
  id: 'deck',
  type: 'parallel',
  context: {
    cards: [],
    links: [],
    active: []
  },
  states: {
    mode: {
      initial: 'initializing',
      states: {
        active: {
          on: {
            "PHYSICS.ON": { target: "disabled" }, // switch deck to disabled mode if physics gets turned on
            "CARD.CLICK": {
              actions: (context, event) => {
                const card = context.cards.find(card => event.id === card.id)
                card.ref.send({ type: "OPEN" })
              }
            },
            "CARD.INERTIFY": {
              actions: (context,event) => {
                const card = context.cards.find(card => event.id === card.id)
                card.ref.send({ type: "INERTIFY" })
              }
            },
            "CARD.READ": {
              actions: (context,event) => {
                const card = context.cards.find(card => event.id === card.id)
                card.ref.send({ type: "SWITCH.READ" })
              }
            },
          },
          entry: send({ type: "PHYSICS.OFF", sentByUser: false }),  // switch physics off when deck is active
          states: {
            readOnly: {
              // popup buttons do not appear, each card's branch and edit buttons are disabled. 'edit' is not possible on cards.
            }, 
            modifiable: {
              initial: 'regular',
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
                        
                      ]
                    },
                    "NODECARD.CLICK": {
                      // works for both active and inert target cards; 
                      // create link between cards
                      actions: [
                        send((context, event) => ({ type: "LINK.PERSIST" }))
                      ]
                    }
                  }
                },
                regular: {
                  on: {
                    "BRANCHBUTTON.CLICK": { target: "linkcreation" }
                  }
                }
              },
              on: {
                "CLICK.BACKGROUND": {
                  actions: {
                    // popup button for creating card
                  }
                },
                "BUTTON.CREATECARD": {
                  actions: 'createNewCard'
                },
                "CLICK.EDGE": {
                  // popup button for deleting the edge
                }, 
                "CARD.EDIT": {
                  actions: (context,event) => {
                    console.log('active.modifiable -> CARD.EDIT')
                    const card = context.cards.find(card => event.id === card.id)
                    card.ref.send({ type: "SWITCH.EDIT" })
                  }
                }
              }
            }
          }
        },
        initializing: {
          on: {
            "CREATECARD": {
              actions: 'createNewCard'
            },
            "CREATELINK": {
              actions: 'createNewLink'
            },
            "INIT.COMPLETE": {
              actions: send("DECK.READONLY")
            }
          }
        },
        disabled: {
          // in this state, all Nodecards functionality is disabled, leaving just the naked graph renderer.
          entry: (context, event) => {
            context.cards.forEach(card => {
              card.ref.send('INERTIFY')
            })
          }
        } 
      },
      on: {
        "DECK.READONLY": { target: 'mode.active.readOnly' },
        "DECK.MODIFIABLE": { target: 'mode.active.modifiable' },
        "DECK.DISABLE": { target: 'mode.disabled' }
      } //transitions are placed on the 'mode' state instead of its child states, since any state can transition to any other.
      //otherwise you have to duplicate transitions for each state.
    },
    persisting: {
      initial: 'disabled',
      states: {
        enabled: {
          "PERSIST.OFF": { target: 'disabled' },
          "CARD.PERSIST": { actions: (context, event) => {}},
          "LINK.PERSIST": { actions: (context, event) => {}},
          "NEWCARD.PERSIST": { actions: (context, event) => {}}
        },
        disabled: {
          "PERSIST.ON": { target: 'enabled' }
        }
      }
    },
    physics: {
      initial: 'initializing',
      states: {
        initializing: {
          on: {
            "PHYSICS.OFF": { target: 'disabled' }
          }
        },
        enabled: {
          on: {
            "PHYSICS.OFF": { target: 'disabled' }
          },
          entry: send({ type: "DECK.DISABLE", sentByUser: false })
        },
        disabled: {
          on: {
            "PHYSICS.ON": { target: 'enabled' }
          }
        }
      }
    }
  }
}, {
  actions: {
    createNewCard: assign({
      cards: (context, event) => {
        const { id, label, text } = event;
        return context.cards.concat({
          id,
          ref: spawn(cardMachine({id,label,text}), { sync: true })
          .onTransition((state) => { 
            //console.log('child machine ->', 'state.value:', state.value, 'state.context:', state.context)
          })
        })
      }
    }),
    createNewLink: assign({
      links: (context, event) => {
        const { id, label, from, to } = event;
        return context.links.concat({
          id,
          label,
          from,
          to
        })
      }
    })
  }
})