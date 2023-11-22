import Shepherd from 'shepherd.js';
import '../node_modules/shepherd.js/dist/css/shepherd.css';

const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    cancelIcon: { enabled: true },
    classes: 'shadow-md bg-purple-dark class-1 class-2',
    // scrollTo: true
    // scrollTo: { behavior: 'smooth', block: 'center' }
  }
});


export const guidedTour = (send) => { 
  tour.addStep({
    id: 'first-step',
    text: 'First step',
    // classes: 'example-step-extra-class',
    buttons: [
      {
        text: 'Next',
        //action: tour.next
        action() {
          tour.next()
        } 
      },
      {
        text: 'Back',
        action: tour.back
      }
    ]
  });
  
  tour.addStep({
    id: 'second-step',
    text: 'Second step',
    attachTo: {
      //element: "[data-id='three']",
      element: '.branch',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Next',
        action() {
          tour.next()
        } 
      }
    ]
  });
  
  tour.addStep({
    id: 'third-step',
    text: 'Third step',
    attachTo: {
      element: '.drag',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Next',
        action() {
          tour.next()
        } 
      }
    ]
  });
  
  tour.addStep({
    id: 'fourth-step',
    text: 'Fourth step',
    attachTo: {
      element: '.lock',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Next',
        action() {
          tour.next()
        } 
      }
    ]
  });
  
  tour.addStep({
    id: 'fifth-step',
    text: 'Fifth step',
    attachTo: {
      element: '.discard',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Next',
        action() {
          tour.next()
        } 
      }
    ]
  });
  
  tour.addStep({
    id: 'sixth-step',
    text: 'Sixth step',
    attachTo: {
      element: '.inertify',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Next',
        action() {
  
          tour.next()
        } 
      }
    ]
  });
  
  tour.addStep({
    id: 'seventh-step',
    text: 'Seventh step',
    buttons: [
      {
        text: 'Next',
        action() {
          send({ type: "mediate", childType: "INERTIFY", data: { id: "three" } })
          tour.next()
        } 
      }
    ]
  });
  
  const first = () => send({ type: "decidePath", id: "three"})

  tour.start();
  setTimeout(() => {
    first()
  }, 2000)
}