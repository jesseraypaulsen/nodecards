//const expect = require('chai').expect;
// setting "type":"module" in package.json allows ESM modules with Mocha
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

describe('user opens a nodecard', () => {
  
  beforeEach(() => {
    const dom = new JSDOM(
      `<html>
         <body>
         </body>
       </html>`
    );
  
    global.window = dom.window;
    global.document = dom.window.document;
  });

  // scenario
  context('given that the deck is not disabled', () => {
    it('nodecard will open', () => {})
    it('nodecard will display its text', () => {})
    it('will be possible to drag card', () => {})
    it('will be possible to view card\'s source material on the web')
    it('will be possible to close the card')
  })

  context('given that the deck is is in modify mode', () => {
    it('will be possible to switch card to edit state', () => {})
    it('will be possible to delete the card', () => {})
    it('will be possible to link the card to a different pre-existing card')
    it('will be possible to link the card to a newly created card')
  })
})

describe('user creates a new nodecard', () => {

  context('given that the deck is in modify mode, and the user has selected an available space and confirmed the prompt', () => {
    it('a new card will be created and opened', () => {})
  })
})

describe('user links one card to another card', () => {
  
})