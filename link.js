export default function buildLink({ sourceId, targetId, edgetype, deck }) {
  let _id;

  return {
    render,
    unrender,
    addToDeck,
    getId,
    setId,
    getSourceId,
    getTargetId,
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

  function getSourceId() {
    return sourceId;
  }

  function getTargetId() {
    return targetId;
  }

  function getEdgetype() {
    return edgetype;
  }
}
