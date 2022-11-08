//const expect = require('chai').expect;
// setting "type":"module" in package.json allows ESM modules with Mocha
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import Nodecard from "../xstate migration/nodecard.js";

describe('Nodecard', () => {
  
  beforeEach(() => {
    const dom = new JSDOM(
      `<html>
         <body>
          <div id="container"></div>
         </body>
       </html>`
    );
  
    global.window = dom.window;
    global.document = dom.window.document;
  });

  it('open', () => {})
  it('getNodeCenter', () => {})
  it('move', () => {})
  it('renderState', () => {})
  it('read', () => {})
  it('edit', () => {})
  it('updateEditor', () => {})
  it('inertify', () => {})
  it('discard', () => {})
  it('htmlText', () => {})
});