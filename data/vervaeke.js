
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

const typeEdges = {
  dashes: true,
  color: 'lightgrey'
}

const mainNodes = {
  color: {
    //background: "rgb(165, 42, 42)"
    background: "rgb(205, 92, 92)"
  },
  font: {
    color: "white",
    size: 16,
    bold: true
  }
}

const mainEdges = {
  width: 2
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
    { id: "one", label: "dynamical systems", text: "the first card", x: 0, y: 25, config: { ...typeNodes, font: { size: 15, color: "rgb(31, 45, 61)" } }},
    { id: "two", label: "cognitive attention", text: "the second card", x: -150, y: -30, config: mainNodes }, 
    { id: "three", label: "biological evolution", text: "the third card", x: 170, y: -30, config: mainNodes },
    { id: "four", label: "enabling constraints", text: "adfsdff", x: -10, y: 160, config: typeNodes },
    { id: "five", label: "selective constraints", text: "asdfdsfdfs", x: 10, y: -235, config: typeNodes },
    { id: "six", label: "default mode", text: "asdfdsf", x: -110, y: 100 },
    { id: "seven", label: "task-focused mode", text: "adfdsfd", x: -100, y: -150 },
    { id: "eight", label: "variation", text: "asdfdsf", x: 110, y: 100 },
    { id: "nine", label: "scarcity", text: "adfdsfd", x: 130, y: -150 },
    { id: "ten", label: "feedback cycles", text: "adfdsfd", x: 10, y: -125, config: typeNodes },
    { id: "eleven", label: "sensory motor loop", text: "adfdsfd", x: -50, y: -65, config: loops },
    { id: "twelve", label: "reproduction", text: "adfdsfd", x: 75, y: -65, config: loops }
  ],
  links: [
    { id: "a", label: "", from: "one", to: "two", arrows: "to", ...typeEdges},
    { id: "b", label: "", from: "one", to: "three", arrows: "to", ...typeEdges },
    { id: "c", label: "", from: "four", to: "six", arrows: "to", ...typeEdges },
    { id: "d", label: "", from: "four", to: "eight", arrows: "to", ...typeEdges },
    { id: "e", label: "", from: "five", to: "seven", arrows: "to", ...typeEdges },
    { id: "f", label: "", from: "five", to: "nine", arrows: "to", ...typeEdges },
    { id: "g", label: "", from: "two", to: "six", ...mainEdges },
    { id: "h", label: "", from: "two", to: "seven", ...mainEdges },
    { id: "i", label: "", from: "three", to: "eight", ...mainEdges },
    { id: "j", label: "", from: "three", to: "nine", ...mainEdges },
    { id: "k", label: "", from: "ten", to: "eleven", arrows: "to", ...typeEdges },
    { id: "l", label: "", from: "ten", to: "twelve", arrows: "to", ...typeEdges },
    { id: "m", label: "", from: "eleven", to: "two", ...mainEdges },
    { id: "n", label: "", from: "twelve", to: "three", ...mainEdges }
  ]
}
