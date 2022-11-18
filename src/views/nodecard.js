//import { removeElement, collapse } from './dom'
//import { createNode, createEdge, removeNode, moveNode } from './graph'

function nodecard() {

  const createCard = ({id, label}) => {
    createNode(id, label)
  }

  const createLink = ({id, label, to, from}) => {
    createEdge(id,label,to,from)
  }



  // bridging functions

  // for drag?
  const move = (id) => {
    moveNode(id)
    setPosition(id)
  }

  
  const discard = (id) => {
    removeNode(id)
    removeElement(id)
  }

  const inertify = (id) => {
    collapse(id)
    //updateNode(id)
  }
  
  return (state) => {
    // get id from state context.
    // render by state.
  }
}