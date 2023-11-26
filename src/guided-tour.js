const driver = window.driver.js.driver;

export const guidedTour = (send, calculatePositionThenCreate) => {

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

          // calculatePositionThenCreate("adfsdijij", "aeoiocijaji", "aoimcpijioej", {
          //   "x": 780,
          //   "y": 295
          // })
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
            calculatePositionThenCreate("newCard", "new card", "blah blah blah blah blah blah blah", {
              //DOM coordinates
              "x": 180,
              "y": 280
            })

            // crude hack.. delay next step so that the new nodecard has time to fully materialize, 
            // and erase the lingering popover div from this current step in the meantime
            setTimeout(() => {
              driverObj.moveNext();
            }, 1000)
            console.log(options.state.popover.wrapper)
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
        onDeselected: () => guided2er(send, calculatePositionThenCreate)
      },
    ]
  });
  
  driverObj.drive();

  //todo: step that shows that turning off App mode lets you move the nodes around without expanding them

  send({ type: "decidePath", id: "three"})

  //https://driverjs.com/docs/configuration

}

export const guided2er = (send, calculatePositionThenCreate) => {
  const driverObj = driver()
  driverObj.highlight({ popover: { description: "hi!"}})
  //driverObj.highlight({ popover: { description: "hi again!!"}}) // only lets you do one of these
}