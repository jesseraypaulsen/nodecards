class Nodecard {
  constructor(id) {
    this.id = id;
    this.type = null; // block-card, page-card, table-card
    this.roles = []; // one for each context (where a context is a graph snapshot)
  }
}
