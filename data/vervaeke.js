
const typeNodes = {
  color: {
    background: "lightgrey"
  },
  font: {
    color: "rgb(31, 45, 61)",
    size: 10 // the size of the node is derived from label font size
  },
  //opacity: .4 // doesn't work
}

const primaryTypeNode = { 
  color: { 
    background: "lightgrey" 
  }, 
  font: { 
    size: 13, 
    color: "rgb(31, 45, 61)" 
  } 
}

const typeEdges = {
  dashes: true,
  color: 'grey'
}

const mainNodes = {
  color: {
    //background: "rgb(165, 42, 42)"
    background: "rgb(205, 92, 92)"
  },
  font: {
    color: "white",
    size: 14,
    bold: true
  }
}

const loops = {
  color: { 
    background: "lightblue"
  },
  font: {
    color: "rgb(31, 45, 61)"
  }
}


export const data = {
  cards: [
    { id: "one", label: "dynamical systems", text: "a dynamical system is a feedback cycle regulated by opposing constraints.",  x: 10, y: -250, config: primaryTypeNode },
    { id: "two", label: "cognitive attention", text: "some possibilities survive in the tradeoff process between constraints, and they go on to shape the sensory-motor loop.", x: -80, y: -160, config: mainNodes }, 
    { id: "three", label: "biological evolution", text: "evolution was the first dynamical systems theory. the interplay of variation and scarcity makes the cycle of evolution possible.", x: 80, y: -160, config: mainNodes },
    { id: "four", label: "enabling constraints", text: "enabling constraints make some events more possible.", x: 0, y: 175, config: typeNodes },
    { id: "five", label: "selective constraints", text: "selective constraints reduce the options and possibilities.", x: 0, y: 280, config: typeNodes },
    { id: "six", label: "default mode", text: "the default mode is related to day-dreaming or the wandering mind. it introduces variation and new possibilities into attention.", x: -65, y: 120 },
    { id: "seven", label: "task-focused mode", text: "this selective constraint kills off most of the options introduced during mind-wandering.", x: -110, y: 200 },
    { id: "eight", label: "variation", text: "genetic trait variation enables new possibilities.", x: 65, y: 100 },
    { id: "nine", label: "scarcity", text: "scarcity of resources eliminates many of the new options that emerge.", x: 120, y: 200 },
    { id: "ten", label: "feedback cycles", text: "In a feedback cycle, the output from the system feeds back into the system.", x: 0, y: 70, config: typeNodes },
    { id: "eleven", label: "sensory motor loop", text: "you sense in order to move thru your environment, and as you move it changes what you can sense.", x: -35, y: -40, config: loops },
    { id: "twelve", label: "reproduction", text: "this feedback cycle is regulated by the interplay of variation and scarcity.", x: 35, y: -10, config: loops }
  ],
  links: [
    { id: "a", label: "", from: "one", to: "two", ...typeEdges},
    { id: "b", label: "", from: "one", to: "three", ...typeEdges },
    { id: "c", label: "", from: "four", to: "six", ...typeEdges },
    { id: "d", label: "", from: "four", to: "eight", ...typeEdges },
    { id: "e", label: "", from: "five", to: "seven", ...typeEdges },
    { id: "f", label: "", from: "five", to: "nine", ...typeEdges },
    { id: "g", label: "", from: "two", to: "six" },
    { id: "h", label: "", from: "two", to: "seven" },
    { id: "i", label: "", from: "three", to: "eight" },
    { id: "j", label: "", from: "three", to: "nine" },
    { id: "k", label: "", from: "ten", to: "eleven", ...typeEdges },
    { id: "l", label: "", from: "ten", to: "twelve", ...typeEdges },
    { id: "m", label: "", from: "two", to: "eleven" },
    { id: "n", label: "", from: "three", to: "twelve" }
  ]
}
