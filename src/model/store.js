export default class Store {
  constructor({key, storage}) {
    this._storage = storage;
    this._storeKey = key;
  }

  setItem({id, item}) {
    const items = this.getAll();
    items[id] = item;
    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getItem({id}) {
    const items = this.getAll();
    return items[id];
  }

  removeItem({id}) {
    const items = this.getAll();
    delete items[id];
    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._storeKey);
    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (err) {
      window.console.error(`Error parse items. Error: ${err}. Items: ${items}`);
      return emptyItems;
    }
  }
}
