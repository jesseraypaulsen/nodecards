export default function buildLink(cardA, cardB, edgeType, deck) {
  let _id, _databaseId;
  return {
    render,
    unrender,
    addToDeck,
    getId,
    setId,
    getDatabaseId,
    setDatabaseId,
  };
  function render() {
    deck.net.body.data.edges.add({
      from: cardA.id,
      to: cardB.id,
      label: edgeType,
      id: _id,
    });
  }
  function unrender() {
    deck.net.body.data.edges.remove(id);
  }
  function addToDeck() {
    deck.links.push(this);
  }
  function getId() {
    if (_id) return _id;
  }
  function setId(id) {
    _id = id;
  }
  function getDatabaseId() {
    if (_databaseId) return _databaseId;
  }
  function setDatabaseId(databaseId) {
    _databaseId = databaseId;
  }
}
