import mouseCursor from "../assets/mouse-cursor.png";
import mousePointer from "../assets/mouse-pointer.png"
import "../assets/styles/guided-tour.css";

const driver = window.driver.js.driver;

export const guidedTour = (send, createPositionedCard, canvasToDOM, DOMtoCanvas, zooming, network) => {

  //https://github.com/kamranahmedse/driver.js/blob/master/src/highlight.ts
  //setting disableActiveInteraction to true should add .driver-no-interaction to the element.. but it doesn't work.
  //in guided-tour.css, .driver-active-element is overridden so that pointer-events is set to none.


  const driverObj = driver({
    allowClose: false,
    //disableActiveInteraction: true,       // this doesn't work.. 
    showProgress: false,
    //onPopoverRender: () => // fails to execute
    showButtons: ['next'],
    overlayOpacity: .3,
    smoothScroll: true,
    steps: [
      {
        popover: {
          description: "Begin the Guided Tour?",
          onNextClick: (_,__, options) => {
            hidePopover(options)
            afterCardExpands(driverObj.moveNext)
            const origin = { x: "30%", y: "70%" }
            const target = network.canvasToDOM(network.getPosition("three"))
            fakeMouse(origin, target, () => send({ type: "decidePath", id: "three"}))
          }
        },
      },
      { 
        element: '.branch', 
        popover: { 
          description: 'This button allows you to create links between cards, new or pre-existing.',
        },
      },
      { 
        element: '.inertify', 
        popover: { 
          title: 'Inertify', 
          description: 'asoidjfidj',
          side: 'bottom',
          onNextClick: (el,__, options) => { 
            hidePopover(options)
            const origin = { x: "30%", y: "70%" }
            const target = { x: getOffset(el).left, y: getOffset(el).top }
            fakeMouse(origin, target, () =>  {
              el.click()
              setTimeout(() => driverObj.moveNext(), 500)
            })
          }
        },
        onDeselected: (el) => {
          //el.click()
        }
      },
      { 
        popover: { 
          description: 'Double-click or double-tap on empty space to create a new card.',
          onNextClick: (_,__, options) => {
            hidePopover(options)
            const origin = { x: "30%", y: "70%" }
            const target = canvasToDOM({ x: -5, y: 65 })
            fakeMouse(origin, target, openNewCard)
          }
        } 
      },
      {
        element: '[data-id="newCard"]', //this is the card created by the previous step
        popover: {
          description: 'Not only can you create new cards, you can delete them too.',
        },
      },
      {
        element: '.discard',
        popover: {
          description: "This is the button for deletion.",
          onNextClick: (el,__, options) => { 
            hidePopover(options)
            const origin = { x: "30%", y: "70%" }
            const target = { x: getOffset(el).left, y: getOffset(el).top }
            fakeMouse(origin, target, () => driverObj.moveNext())
          }
        },
        onDeselected: (el) => {
            el.click()
            driverObj.destroy()
            setTimeout(() => guided2er(send, zooming), 500)
        }
      },
    ]
  });
  
  const openNewCard = () => {

    createPositionedCard({id: "newCard", label: "new card", text: "blah blah blah", x: -5, y: 65, startInert: false })
  
    // wait until the card has expanded before moving to the next step so that the element is available to the step
    afterCardExpands(driverObj.moveNext)
  }

  driverObj.drive();

}

export const guided2er = (send, zooming) => {
  const driverObj = driver({
    showButtons: ['next'],
    allowClose: false, // necessary to prevent user interaction that would interfere with the effects
    overlayOpacity: 0,
    steps: [
      {
        popover: { 
          description: "You can zoom if you want to.",
          onNextClick: (_,__, options) => {
            hidePopover(options)

            const andFinally = () => driverObj.moveNext()
            const secondZoom = () => setTimeout(() => showZoom(send,zooming,2,andFinally), 1000)

            send({ type: "decidePath", id: "six"})

            const cardStuff = () => {
              const card = document.querySelector('[data-id="six"]')
              const origin = { x: "30%", y: "70%" }
              const target = { x: getOffset(card).left, y: getOffset(card).top }
              fakeMouse(origin, target, () => fakeTyping(send, secondZoom, "six"))
            }

            const container = document.querySelector("#container")
            const handler = () => showZoom(send, zooming, .65, cardStuff)


            // execute the first zoom after the nodecard expands
            afterCardExpands(handler)

          }
        },
        onDeselected: (el, step, options) => {
          console.log(options.state)
          //send({ type: "decidePath", id: "six"})
          driverObj.destroy()
          setTimeout(() => guided3er(send, zooming), 1250)
        }
      }
    ],
  })
  driverObj.drive()
}

export const guided3er = (send, zooming) => {
  const driverObj = driver({
    showButtons: ['next'],
    allowClose: false, // necessary to prevent user interaction that would interfere with the effects
    overlayOpacity: 0,
    steps: [
      {
        popover: { 
          description: "Fin",
        },
        onDeselected: (el, step, options) => {
          console.log(options.state)
          driverObj.destroy()
        }
      },
    ],
  })
  driverObj.drive()
}
const hidePopover = (options) =>  options.state.popover.wrapper.style = "display:none;"

//https://stackoverflow.com/a/28222246
function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top
  };
}

function fakeMouse(origin, target, afterFakeMouseClick) {
  
  const fakeMouseCursor = document.createElement('img')
  fakeMouseCursor.classList.add("fake-mouse-cursor")
  fakeMouseCursor.src = mouseCursor;
  //fakeMouseCursor.src = mousePointer;

  document.querySelector('#container').append(fakeMouseCursor)
  
  fakeMouseCursor.animate([
    { top: origin.y, left: origin.x },
    { top: target.y + 'px', left: target.x + 'px' }
  ], 750).onfinish = afterFakeMouseClick;
      
}

function fakeTyping(send, callback, id) {
  const input = "you can type stuff into the card"
  let _input = ''
  
  input.split('').forEach((c,i) => {
    setTimeout(() => {
      _input += c
      send({
        type: "mediate",
        childType: "TYPING",
        data: { text: _input, id },
      });
      if (i == input.length-1) callback()
    }, i*200)
  })

}

function showZoom(send, zooming, scale, callback) {
  zooming(scale, send)
  setTimeout(() => {
    callback()
  }, 2000)
}

function afterCardExpands(callback) {
  document.querySelector('#container').addEventListener('animationend', (e) => {
    if (e.animationName == 'expandCard') callback()
  }, { once: true })
}

/*
onHighlighted: (el, step, options) => {
  //this is just a sloppy demonstration to myself for how to customize the popover. 
  //the onPopoverRender hook doesn't execute for me, so I'm using this one instead.
  const popover = options.state.popover;
  const firstButton = document.createElement("button");
  firstButton.innerText = "Go to First";
  popover.description.appendChild(firstButton);

  firstButton.addEventListener("click", () => {
    driverObj.drive(0);
  });

  //driverObj.setConfig({ overlayOpacity: 0}) //erases the steps.. 
  //so there's no way to alter the overlay behavior from one step to the next
},
//onPopoverRender: () => //fails to execute
*/

//todo: 
//- add step that shows that turning off App mode lets you move the nodes around without expanding them
//- the steps should be performed on more than one card.. moving up or down along the contour of the layout.
//- you could add  a step for expanding a card, then one for collapsing the card you previously expanded.
//- a step for linking to a newly created card, and a following step for linking to a pre-existing card.
//- if you have steps for all of the buttons, will the guided tour will be too long?
//- i need to use multiple driverObj instances in order to turn the overlay on and off while doing animated demos

// send({ type: "decidePath", id: "three"})

//https://driverjs.com/docs/configuration
