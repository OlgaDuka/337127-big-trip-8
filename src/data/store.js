export default class Store {
  /**
   * @description Конструктор класса Store
   * @param {String} key Ключ записи хранилища
   * @param {Storage} storage Инстанс хранилища
   * @member Store
   */
  constructor({key, storage}) {
    this._storage = storage;
    this._storeKey = key;
  }
  /**
   * @description Запись данных точки маршрута в хранилище
   * @param {String} id ID точки маршрута
   * @param {Object} item данные точки маршрута
   * @member Store
   */
  setItem({id, item}) {
    const items = this.getAll();
    items[id] = item;
    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  /**
   * @description Запись справочника в хранилище
   * @param {Array} refs массив со справочными данными
   * @member Store
   */
  setRefs(refs) {
    this._storage.setItem(this._storeKey, JSON.stringify(refs));
  }

  /**
   * @description Получение данных точки маршрута из хранилища
   * @param {String} {id} ID точки маршрута
   * @return {Object}
   * @member Store
   */
  getItem({id}) {
    return this.getAll()[id];
  }

  /**
   * @description Получение данных точки маршрута из хранилища
   * @param {String} {id} ID точки маршрута
   * @member Store
   */
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
