import mouseCursor from "../assets/mouse-cursor.png";
import "../assets/styles/guided-tour.css";
const driver = window.driver.js.driver;

export const guidedTour = (send, createPositionedCard, canvasToDOM) => {

  const driverObj = driver({
    showProgress: true,
    overlayOpacity: 0,
    //onPopoverRender: () => console.log('onPopoverRender'), // doesn't execute
    steps: [
      {
        popover: {
          description: "Are you ready for the Guided Tour?"
        }
      },
      { 
        element: '.branch', 
        popover: { 
          title: 'Title', 
          description: 'Description',
          //onPopoverRender: () => console.log('onPopoverRender'), // doesn't execute.. using onHighlighted instead
        } 
      },
      { 
        element: '.drag', 
        popover: { 
          title: 'Title', 
          description: 'Description',
        },
        //hooks
        onHighlightStarted: (el, step, options) => null,
        onHighlighted: (el, step, options) => {
          const popover = options.state.popover;
          console.log(popover)
          const firstButton = document.createElement("button");
          firstButton.innerText = "Go to First";
          popover.description.appendChild(firstButton);

          firstButton.addEventListener("click", () => {
            driverObj.drive(0);
          });

          //driverObj.setConfig({ overlayOpacity: 0}) //erases the steps
        },
        onDeselected: () => console.log('once more.. hi!'),
      },
      { 
        element: '.lock', 
        popover: { 
          title: 'Title', 
          description: 'Description',
        } 
      },
      { 
        element: '.discard', 
        popover: { 
          title: 'Title', 
          description: 'Description',
          onNextClick: (el, step, options) => {

            const fakeMouseCursor = document.createElement('img')
            fakeMouseCursor.classList.add("fake-mouse-cursor")
            fakeMouseCursor.src = mouseCursor;
            document.querySelector('#container').append(fakeMouseCursor)
            
            const domPositions = canvasToDOM({ x: -5, y: 65 })
            console.log('domPositions: ', domPositions)

            const afterFakeMouseClick = () => {

              console.log('afterFakeMouseClick')
              createPositionedCard({id: "newCard", label: "new card", text: "blah blah blah", x: -5, y: 65, startInert: false })

              // crude hack.. delay next step so that the new nodecard has time to fully expand 
              
              //TODO: callback for after nodecard expansion animation?
              setTimeout(() => {
                driverObj.moveNext();
                console.log('moveNext')
              }, 1000)

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
        element: '[data-id="newCard"]',
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
        }
      },
      { 
        popover: { 
          title: 'Create', 
          description: 'double-click on empty space' 
        },
        onDeselected: () => guided2er(send)
      },
    ]
  });
  
  driverObj.drive();

  //todo: step that shows that turning off App mode lets you move the nodes around without expanding them

  send({ type: "decidePath", id: "three"})

  //https://driverjs.com/docs/configuration

}

export const guided2er = (send) => {
  const driverObj = driver()
  driverObj.highlight({ popover: { description: "hi!"}})
  //driverObj.highlight({ popover: { description: "hi again!!"}}) // only lets you do one of these
}