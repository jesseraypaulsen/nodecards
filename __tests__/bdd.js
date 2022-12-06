test("Sanity check", () => {
  expect(true).toBe(true);
});

describe('user opens a nodecard', () => {

  // scenario
  describe('given that the deck is not disabled', () => {
    it('nodecard will open', () => {})
    it('nodecard will display its text', () => {})
    it('will be possible to drag card', () => {})
    it.todo('will be possible to view card\'s source material on the web')
    it.todo('will be possible to close the card')
  })

  describe('given that the deck is is in modify mode', () => {
    it('will be possible to switch card to edit state', () => {})
    it.skip('will be possible to delete the card', () => {})
    it.todo('will be possible to link the card to a different pre-existing card')
    it.todo('will be possible to link the card to a newly created card')
  })
})

describe('user creates a new nodecard', () => {

  describe('given that the deck is in modify mode, and the user has selected an available space and confirmed the prompt', () => {
    it('a new card will be created and opened', () => {})
  })
})

describe('user links one card to another card', () => {
  
})