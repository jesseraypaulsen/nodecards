import graphViews from './graph';
import domViews from './dom';

export default function nodecardViews(graphAPI, domControllers) {

  const { collapse, expand, removeElement, setPosition, fillElement, synchPanel, openPrompt, closePrompt, updateEditor } = domViews(domControllers);
  const { createNode, createEdge, moveNode, removeNode, setPhysics } = graphViews(graphAPI);

  const createCard = (id, label) => {

    createNode(id, label)

  }

  const createLink = ({ id, label, from, to }) => {

    createEdge( id, label, from, to)

  }

  const move = (id) => {

    moveNode(id)

    setPosition(qs('#' + id))

  }

  
  const discard = (id) => {

    removeNode(id)

    removeElement('#' + id)

  }

  const inertify = (id) => {

    collapse(id)

    //updateNode(id)

  }

  
  const expandCard = ({ id, x, y, nestedState, text }) => {

    expand({ id, x, y, nestedState, text })

  }
  
  return { 
    createCard, 
    createLink,
    discard, 
    inertify, 
    expandCard, 
    fillElement,
    synchPanel,
    openPrompt,
    closePrompt,
    updateEditor,
    setPhysics
  }
}