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
    // overlayOpacity: .3,
    overlayOpacity: 0,
    smoothScroll: true,
    steps: [
      {
        popover: {
          title: "Welcome to Nodecards",
          description: "Lets take a quick tour to see what it does.",
          showButtons: ['next', 'close'],
          onNextClick: (_,__, options) => {
            hidePopover(options)
            afterCardExpands(driverObj.moveNext)
            const target = network.canvasToDOM(network.getPosition("three"))
            fakeMouse(target, () => send({ type: "decidePath", id: "three"}))
          }
        },
      },
      { 
        element: '.branch', 
        popover: { 
          description: 'You can link one nodecard to another.',
          onNextClick: (el,_,options) => {
            hidePopover(options)
            const firstTarget = { x: getOffset(el).left, y: getOffset(el).top }
            const secondTarget = network.canvasToDOM(network.getPosition("six"))
            const link = () => {
              el.click()
              setTimeout(() => {
                fakeMouse(secondTarget, () => {
                  send({type: 'decidePath', id: "six"})
                })
              }, 400)
              setTimeout(() => driverObj.moveNext(), 1000)
            }
            fakeMouse(firstTarget, link)
          }
        },
      },
      { 
        element: '.inertify', 
        popover: {  
          description: 'You can then collapse a nodecard back down to its inert state.',
          side: 'bottom',
          onNextClick: (el,__, options) => { 
            hidePopover(options)
            const target = { x: getOffset(el).left, y: getOffset(el).top }
            fakeMouse(target, () =>  {
              el.click()
              setTimeout(() => driverObj.moveNext(), 500)
            })
          }
        }
      },
      { 
        popover: { 
          description: 'You can create a new card by double-clicking or double-tapping on empty space.',
          onNextClick: (_,__, options) => {
            hidePopover(options)
            const target = canvasToDOM({ x: -5, y: 65 })
            fakeMouse(target, openNewCard)
          }
        } 
      },
      {
        element: '.discard',
        popover: {
          description: "You can delete a card.",
          side: 'bottom',
          onNextClick: (el,__, options) => { 
            hidePopover(options)
            const target = { x: getOffset(el).left, y: getOffset(el).top }
            fakeMouse(target, () => driverObj.moveNext())
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
          description: "You can also zoom in and out by using two fingers on the touchpad or screen.",
          onNextClick: (_,__, options) => {
            hidePopover(options)

            send({ type: "decidePath", id: "six"})

            //const handler = () => showZoom(send, zooming, .65, cardStuff)
            const handler = () => showZoom(send, zooming, .65, () => driverObj.moveNext())

            // execute the first zoom after the nodecard expands
            afterCardExpands(handler)

          }
        },
      },
      {
        element: '[data-id="six"]',
        popover: { 
          description: "And of course you can type notes into a card.",
          onNextClick: (_,__,options) => {
            hidePopover(options)
            const andFinally = () => driverObj.moveNext()
            const secondZoom = () => setTimeout(() => showZoom(send,zooming,2,() => {}), 1000)
            const cardStuff = () => {
              const card = document.querySelector('[data-id="six"]')

              const target = { x: getOffset(card).left, y: getOffset(card).top }
              fakeMouse(target, () => fakeTyping(send, secondZoom, andFinally, "six"))
            }
            cardStuff()
          }
        },
      },
      {
        popover: {
          description: "Fin."
        },
        onDeselected: () => {
          driverObj.destroy()
        }
      }
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

function fakeMouse(target, afterFakeMouseClick) {
  
  const fakeMouseCursor = document.createElement('img')
  fakeMouseCursor.classList.add("fake-mouse-cursor")
  fakeMouseCursor.src = mouseCursor;

  document.querySelector('#container').append(fakeMouseCursor)

  // the path of mouse movement should be very short to make its unnatural appearance less obvious
  const vary = (Math.random() < 0.5)  ? 50 : -50;
  const originX = target.x + vary + 'px';
  const originY = target.y + 50 + 'px';
  
  fakeMouseCursor.animate([
    { top: originY, left: originX },
    { top: target.y + 'px', left: target.x + 'px' }
  ], 500).onfinish = afterFakeMouseClick;
      
}

function fakeTyping(send, firstCallback, secondCallback, id) {
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
      if (i == Math.ceil(input.length/3)) firstCallback()
      if (i == input.length-1) secondCallback()
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

TODO: improve timing of steps and animation

*/

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

//https://driverjs.com/docs/configuration
