import mouseCursor from "../assets/mouse-cursor.png";
import "../assets/styles/guided-tour.css";

const driver = window.driver.js.driver;

export const guidedTour = (send, createPositionedCard, canvasToDOM) => {

  send('beginTour')

  //https://github.com/kamranahmedse/driver.js/blob/master/src/highlight.ts
  //setting disableActiveInteraction to true should add .driver-no-interaction to the element.. but it doesn't work.
  //in guided-tour.css, .driver-active-element is overridden so that pointer-events is set to none.


  const driverObj = driver({
    //overlayOpacity: 0,
    allowClose: false,
    //disableActiveInteraction: true,       // this doesn't work.. 
    showProgress: false,
    //onPopoverRender: () => // fails to execute
    steps: [
      {
        popover: {
          description: "Begin the Guided Tour?"
        }
      },
      { 
        element: '.branch', 
        popover: { 
          //title: 'Link', 
          description: 'This button allows you to create links between cards, new or pre-existing.',
        },
      },
      { 
        element: '.drag', 
        popover: { 
          //title: 'Move', 
          description: 'Move the card by holding this button as you move your finger or the mouse.',
        },
        //hooks
        onHighlightStarted: (el, step, options) => console.log('onHighlightStarted hook'),
        onHighlighted: (el, step, options) => {
          console.log('onHighlighted hook')
          //this is just a sloppy demonstration to myself for how to customize the popover. 
          //the onPopoverRender hook doesn't execute for me, so I'm using this one instead.
          const popover = options.state.popover;
          console.log(popover)
          const firstButton = document.createElement("button");
          firstButton.innerText = "Go to First";
          popover.description.appendChild(firstButton);

          firstButton.addEventListener("click", () => {
            driverObj.drive(0);
          });

          // disable pointer events.. does this include mobile tap events too?
          //el.style.pointerEvents = "none";
          //el.firstElementChild.style.pointerEvents = "none";

          //driverObj.setConfig({ overlayOpacity: 0}) //erases the steps.. 
          //so there's no way to alter the overlay behavior from one step to the next
        },
        onDeselected: () => console.log('onDeselected hook'),
        //onPopoverRender: () => //fails to execute
      },
      { 
        element: '.lock', 
        popover: { 
          //title: 'Title', 
          description: 'Lock the card to prevent the text from being changed.',
        } 
      },
      { 
        popover: { 
          description: 'Double-click or double-tap on empty space to create a new card.',
          onNextClick: (el, step, options) => {

            const fakeMouseCursor = document.createElement('img')
            fakeMouseCursor.classList.add("fake-mouse-cursor")
            fakeMouseCursor.src = mouseCursor;
            document.querySelector('#container').append(fakeMouseCursor)
            
            const domPositions = canvasToDOM({ x: -5, y: 65 })

            const afterFakeMouseClick = () => {

              createPositionedCard({id: "newCard", label: "new card", text: "blah blah blah", x: -5, y: 65, startInert: false })

              // wait until the card has expanded before moving to the next step so that the element is available to the step
              document.querySelector('#container').addEventListener('animationend', (e) => {
                if (e.animationName == 'expandCard') driverObj.moveNext(); 
              }, { once: true })            

            }

            fakeMouseCursor.animate([
              { top: "99%", right: "1%" },
              { top: domPositions.y + 'px', right: domPositions.x + 'px' }
            ], 2000).onfinish = afterFakeMouseClick;
              
            // erase the lingering popover div from this current step in the meantime
            options.state.popover.wrapper.style = "display:none;"
          },
        } 
      },
      {
        element: '[data-id="newCard"]', //this is the card created by the previous step
        popover: {
          title: 'new card',
          description: 'blah blah blah blah blah'
        },
        onDeselected: (el) => {
          el.querySelector('.inertify').click()
        }
      },
      { 
        element: '.inertify', 
        popover: { 
          title: 'Inertify', 
          description: 'asoidjfidj',
          side: 'bottom'
        }
      },
      { 
        popover: { 
          title: 'Zoom', 
          description: 'show how you can still write in a tiny card. find the right event terminology for both laptop/desktop and mobile.' 
        },
        onDeselected: () => guided2er(send)
      }
    ]
  });
  
  driverObj.drive();

  //todo: 
  //- add step that shows that turning off App mode lets you move the nodes around without expanding them
  //- the individual steps for each button should each happen on a different card.. moving up or down along the contour of the layout.
  //- add step that deletes the newly created card, right after the card creation step.
  //- on the step after card creation step, you need a function in the hook for the prevStep button that deletes the card.. otherwise 
  //if you return to the previous step and then click the button again, another card gets created on top of the previous one.
  //- you could add  a step for expanding a card, then one for collapsing the card you previously expanded.
  //- a step for linking to a newly created card, and a following step for linking to a pre-existing card.
  //- a step for dragging a card.
  //- a step for locking the card.
  //- if you have steps for all of the buttons, will the guided tour will be too long?
  //- i need to use multiple driverObj instances in order to turn the overlay on and off while doing animated demos

  send({ type: "decidePath", id: "three"})

  //https://driverjs.com/docs/configuration

}

export const guided2er = (send) => {
  const driverObj = driver()
  driverObj.highlight({ popover: { description: "hi!"}})
  send('endTour')
  //driverObj.highlight({ popover: { description: "hi again!!"}}) // only lets you do one of these
}