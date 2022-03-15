export default function buildLink({ sourceId, targetId, edgetype, deck }) {
  let _id, _databaseId;
  return {
    render,
    unrender,
    addToDeck,
    getId,
    setId,
    getDatabaseId,
    setDatabaseId,
    getSource,
    getTarget,
  };
  function render() {
    deck.net.body.data.edges.add({
      from: sourceId,
      to: targetId,
      label: edgetype,
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
  function getSource() {
    return sourceId;
  }
  function getTarget() {
    return targetId;
  }
}
