export default function buildLink({ sourceId, targetId, edgetype, deck }) {
  let _id, _databaseId, _sourceDatabaseId, _targetDatabaseId;
  return {
    render,
    unrender,
    addToDeck,
    getId,
    setId,
    getDatabaseId,
    setDatabaseId,
    getSourceId,
    getTargetId,
    getSourceDatabaseId,
    getTargetDatabaseId,
    setSourceDatabaseId,
    setTargetDatabaseId,
    getEdgetype,
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
  function getSourceId() {
    return sourceId;
  }
  function getTargetId() {
    return targetId;
  }
  function getSourceDatabaseId() {
    return _sourceDatabaseId;
  }
  function getTargetDatabaseId() {
    return _targetDatabaseId;
  }
  function setSourceDatabaseId(val) {
    _sourceDatabaseId = val;
  }
  function setTargetDatabaseId(val) {
    _targetDatabaseId = val;
  }
  function getEdgetype() {
    return edgetype;
  }
}
