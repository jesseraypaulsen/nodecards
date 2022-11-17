import Nodecard from "../src/nodecard.js";
import attachButtonBar from "../src/button-bar.js"

describe('Nodecard', () => {

  test('open', () => {
    /* 
      dom stuff
      renderState(state) -> side-effect, spy?
      append to deck.container
      getNodeCenter
      deck.setPosition
    */

  })
  test('getNodeCenter', () => {
    /* 
      call deck.graphRenderer
      return values
    */
  })
  test('move', () => {
    /* 
      call deck.graphRenderer
      call deck.setPosition
    */
  })
  test('renderState', () => {
    /* 
      dom stuff
      attachButtonBar(this, state) -> side-effect, spy?
    */
  })
  test('read', () => {
    /* 
      dom stuff
      call htmlText
      return element
    */
  })
  test('edit', () => {
    /* 
      dom stuff
      use deck in event listener
      return element
    */
  })
  test('updateEditor', () => {
    // assign value on dom element
  })
  test('inertify', () => {
    /*
      dom stuff
      deck.graphRenderer
    */
  })
  test('discard', () => {
    /* 
      dom stuff
      deck operations
    */
  })
  test('htmlText', () => {
    /* 
      return value based on input
    */
  })

});

test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});

test('click', () => {
  document.body.innerHTML = 
    `<div>
      <button id="btn" />
    </div>`
  let status = false;
  const btn = document.querySelector('#btn');
  btn.addEventListener('click', () => {
    status = true;
  })

  btn.click();

  expect(status).toBe(true);
})