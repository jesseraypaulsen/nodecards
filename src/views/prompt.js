import { render, qs, div, setPosition } from './dom-helpers'

export default function promptView (controller) {
  
  const openPrompt = ({ x, y }) => {
    
    const prompt = div("creation-prompt");
    
    prompt.innerHTML = `<span>x</span><span>Create Card</span>`
    
    render(prompt); //append must occur before setPosition
    
    setPosition(prompt, x, y)
    
    prompt.firstElementChild.addEventListener('click', () => controller.close())
    
  }
  const closePrompt = () => {
      
    const prompt = qs(".creation-prompt");
    
    if (prompt) prompt.remove();
    
  }

  return { openPrompt, closePrompt }

}



