const EVENTS_STORE_KEY = `events-store-key`;

export default class Store {
  constructor() {
    this._storage = localStorage;
    this._storeKey = EVENTS_STORE_KEY;
  }
  setItem({key, item}) {
    const items = this.getAll();
    items[key] = item;

    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getItem({key}) {
    const items = this.getAll();
    return items[key];
  }

  removeItem({key}) {
    const items = this.getAll();
    delete items[key];

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
    } catch (e) {
      window.console.error(`Error parse items. Error: ${e}. Items: ${items}`);
      return emptyItems;
    }
  }
}
