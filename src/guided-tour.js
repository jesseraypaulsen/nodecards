const driver = window.driver.js.driver;


const driverObj = driver({
  showProgress: true,
  onPopoverRender: (popover, { config, state }) => console.log('onPopoverRender'), // doesn't execute
  onPopoverRender: () => console.log('onPopoverRender'),
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
        onPopoverRender: () => console.log('onPopoverRender'),
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
      },
      onDeselected: () => console.log('once more.. hi!'),
      onPopoverRender: () => console.log('onPopoverRender'), // doesn't get called -- using onHighlighted instead
    },
    { 
      element: '.lock', 
      popover: { 
        title: 'Title', 
        description: 'Description',
        onPopoverRender: () => console.log('onPopoverRender'),
      } 
    },
    { 
      element: '.discard', 
      popover: { 
        title: 'Title', 
        description: 'Description',
        onPopoverRender: () => console.log('onPopoverRender'),
      } 
    },
    { 
      element: '.inertify', 
      popover: { 
        title: 'Inertify', 
        description: 'asoidjfidj' 
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
      }
    },
  ]
});
  
driverObj.drive();



export const guidedTour = (send) => {

  setTimeout(() => {
    send({ type: "decidePath", id: "three"})
  }, 1000)

  //https://driverjs.com/docs/configuration

}