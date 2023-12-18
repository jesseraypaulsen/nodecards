
const typeNodes = {
  color: {
    background: "grey"
  },
  font: {
    color: "black",
    size: 12 // determines the size of the node itself
  }
}


export const data = {
  cards: [
    { id: "one", label: "opponent processes", text: "the first card", x: 0, y: 0 },
    { id: "two", label: "cognitive attention", text: "the second card", x: -110, y: -30 }, 
    { id: "three", label: "biological evolution", text: "the third card", x: 130, y: -30 },
    { id: "four", label: "enabling constraints", text: "adfsdff", x: -10, y: 160, config: typeNodes },
    { id: "five", label: "selective constraints", text: "asdfdsfdfs", x: 10, y: -235, config: typeNodes },
    { id: "six", label: "default mode", text: "asdfdsf", x: -110, y: 100 },
    { id: "seven", label: "task-focused mode", text: "adfdsfd", x: -100, y: -150 },
    { id: "eight", label: "variation", text: "asdfdsf", x: 110, y: 100 },
    { id: "nine", label: "scarcity", text: "adfdsfd", x: 130, y: -150 },
    { id: "ten", label: "feedback cycles", text: "adfdsfd", x: 10, y: -125 },
    { id: "eleven", label: "sensory motor loop", text: "adfdsfd", x: -50, y: -65 },
    { id: "twelve", label: "reproduction", text: "adfdsfd", x: 75, y: -65 }



  ],
  links: [
    { id: "a", label: "", from: "one", to: "two", arrows: "to" },
    { id: "b", label: "", from: "one", to: "three", arrows: "to" },
    { id: "c", label: "", from: "four", to: "six", arrows: "to" },
    { id: "d", label: "", from: "four", to: "eight", arrows: "to" },
    { id: "e", label: "", from: "five", to: "seven", arrows: "to"},
    { id: "f", label: "", from: "five", to: "nine", arrows: "to" },
    { id: "g", label: "", from: "two", to: "six" },
    { id: "h", label: "", from: "two", to: "seven" },
    { id: "i", label: "", from: "three", to: "eight" },
    { id: "j", label: "", from: "three", to: "nine" },
    { id: "k", label: "", from: "ten", to: "eleven", arrows: "to" },
    { id: "l", label: "", from: "ten", to: "twelve", arrows: "to" },
    { id: "m", label: "", from: "eleven", to: "two" },
    { id: "n", label: "", from: "twelve", to: "three" }
  ]
}
