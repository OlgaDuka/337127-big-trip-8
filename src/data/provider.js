import Adapter from './adapter';

export default class Provider {
  /**
   * @description Конструктор класса Provider
   * @param {LoaderData} loaderData Инстанс LoaderData - загрузчика данных
   * @param {Storage} store Инстанс Store - хранилища данных
   * @param {Function} generateId Метод генерации ID записи
   * @member Provider
   */
  constructor({loaderData, store, generateId}) {
    this._loader = loaderData;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;

    this._sendStorage = this._sendStorage.bind(this);
  }
  /**
   * @description Отправить данные в хранилище
   * @param {point} point Данные точки маршрута
   * @return {point} point Данные точки маршрута
   * @member Provider
   */
  _sendStorage(point) {
    this._store.setItem({
      id: point.id,
      item: Adapter.toRAW(point)
    });
    return point;
  }

  /**
   * @description Запрос на получение данных всех точек маршрута
   * @return {JSON} Данные в JSON-формате
   * @member Provider
   */
  getPoints() {
    if (Provider.isOnline()) {
      return this._loader.getPoints()
        .then((points) => {
          points.forEach(this._sendStorage);
          return points;
        });
    }
    return Promise.resolve(Adapter.parsePoints(Provider.objectToArray(this._store.getAll())));
  }

  /**
   * @description Запрос на получение справочника предложений по типам точек маршрута
   * @return {JSON} Данные в JSON-формате
   * @member Provider
   */
  getOffers() {
    if (Provider.isOnline()) {
      return this._loader.getOffers()
        .then((offers) => {
          this._store.setRefs(offers);
          return offers;
        });
    }
    return Promise.resolve(this._store.getAll());
  }

  /**
   * @description Запрос на получение справочника пунктов назначения
   * @return {JSON} Данные в JSON-формате
   * @member Provider
   */
  getDestinations() {
    if (Provider.isOnline()) {
      return this._loader.getDestinations()
        .then((destinations) => {
          this._store.setRefs(destinations);
          return destinations;
        });
    }
    return Promise.resolve(this._store.getAll());
  }

  /**
   * @description Запрос на создание точки маршрута
   * @param {*} {point} Данные точки маршрута
   * @return {JSON} Ответ сервера в JSON-формате
   * @member Provider
   */
  createPoint({point}) {
    if (Provider.isOnline()) {
      return this._loader.createPoint({point})
        .then(this._sendStorage);
    } else {
      point.id = this._generateId();
      point = Adapter.parsePoint(point);
      this._needSync = true;
      this._sendStorage(point);
      return Promise.resolve(point);
    }
  }

  /**
   * @description Запрос на обновление точки маршрута
   * @param {String} id ID точки маршрута
   * @param {Object} data Данные точки маршрута
   * @return {JSON} Ответ сервера в JSON-формате
   * @member Provider
   */
  updatePoint({id, data}) {
    if (Provider.isOnline()) {
      return this._loader.updatePoint({id, data})
        .then(this._sendStorage);
    } else {
      const point = Adapter.parsePoint(data);
      this._needSync = true;
      this._sendStorage(point);
      return Promise.resolve(point);
    }
  }

  /**
   * @description Запрос на удаление точки маршрута
   * @param {String} {id} ID точки маршрута
   * @return {Promise}
   * @member Provider
   */
  deletePoint({id}) {
    if (Provider.isOnline()) {
      return this._loader.deletePoint({id})
        .then(() => {
          this._store.removeItem({id});
        });
    } else {
      this._needSync = true;
      this._store.removeItem({id});
      return Promise.resolve(id);
    }
  }

  /**
   * @description Синхронизация данных хранилища и сервера
   * @return {JSON}
   * @member Provider
   */
  syncPoints() {
    return this._loader.syncPoints({
      points: Provider.objectToArray(this._store.getAll())
    })
    .then(() => {
      this._needSync = false;
    });
  }
  /**
   * @description Проверка статуса подключения к сети интернет
   * @static
   * @return {Boolean}
   * @member Provider
   */
  static isOnline() {
    return window.navigator.onLine;
  }
  /**
   * @description Преобразование объекта данных в массив
   * @static
   * @param {Object} object Объект данных
   * @return {Array} Массив данных
   * @member Provider
   */
  static objectToArray(object) {
    return Object.keys(object).map((id) => object[id]);
  }

}
