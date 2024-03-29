import mouseCursor from "../assets/mouse-cursor.png";
//import mousePointer from "../assets/mouse-pointer.png"
import "../assets/styles/guided-tour.css";

const driver = window.driver.js.driver;

export const guidedTour = (send, createPositionedCard, canvasToDOM, DOMtoCanvas, zooming, network) => {

  //https://github.com/kamranahmedse/driver.js/blob/master/src/highlight.ts
  //setting disableActiveInteraction to true should add .driver-no-interaction to the element.. but it doesn't work.
  //in guided-tour.css, .driver-active-element is overridden so that pointer-events is set to none.


  const driverObj = driver({
    allowClose: false, // prevent user interaction that would interfere with the effects.
    //disableActiveInteraction: true, // doesn't work.
    //onPopoverRender: () => // fails to execute.
    showProgress: false,
    showButtons: ['next'],
    overlayOpacity: 0,
    smoothScroll: true,
    popoverClass: "driverjs-theme",
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
          side: "left",
          onNextClick: (el,_,options) => {
            hidePopover(options)
            const firstTarget = { x: getOffset(el).left, y: getOffset(el).top }
            const secondTarget = network.canvasToDOM(network.getPosition("two"))
            const link = () => {
              el.click()
              setTimeout(() => {
                fakeMouse(secondTarget, () => {
                  send({type: 'decidePath', id: "two"})
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
            const pos = { x: 0, y: -115 }
            const openNewCard = () => {
          
              createPositionedCard({id: "newCard", label: "new card", text: "", x: pos.x, y: pos.y, startInert: false })
            
              // wait until the card has expanded before moving to the next step so that the element is available to the step
              afterCardExpands(driverObj.moveNext)
            }
            const target = canvasToDOM(pos)
            fakeMouse(target, openNewCard)
          }
        } 
      },
      {
        popover: { 
          description: "You can also zoom in and out by using two fingers on the touchpad or screen.",
          onNextClick: (_,__, options) => {
            hidePopover(options)

            const secondZoom = () => setTimeout(() => zooming(2,send), 1000)
            const andFinally = () => {
              setTimeout(() => zooming(1,send, () => driverObj.moveNext()), 1000)
            }

            const cardStuff = () => {
              const card = document.querySelector('[data-id="newCard"]')

              const target = { x: getOffset(card).left+10, y: getOffset(card).top+10 }
              console.log(target)
              fakeMouse(target, () => fakeTyping(send, secondZoom, andFinally, "newCard"))
            }

            zooming(.65, send, cardStuff)

          }
        },
      },
      {
        element: '.discard',
        popover: {
          description: "And you can delete cards too.",
          side: 'bottom',
          onNextClick: (el,__, options) => { 
            hidePopover(options)
            const target = { x: getOffset(el).left, y: getOffset(el).top }
            fakeMouse(target, () => driverObj.moveNext())
          }
        },
        onDeselected: (el) => el.click()
      },
      {
        //element: '[data-id="six"]', // highlight the entire nodecard
        popover: { 
          description: "The Guided Tour is finished. User interaction is enabled now.",
        },
        onDeselected: () => {
          driverObj.destroy()
        }
      }
    ]
  });
  

  driverObj.drive();

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

function afterCardExpands(callback) {
  document.querySelector('#container').addEventListener('animationend', (e) => {
    if (e.animationName == 'expandCard') callback()
  }, { once: true })
}


/*
onHighlighted: (el, step, options) => {
  //this shows how to customize the popover if need be,
  //because the onPopoverRender hook doesn't execute.

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
*/

//https://driverjs.com/docs/configuration
