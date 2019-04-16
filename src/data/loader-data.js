import Adapter from './adapter';

const METHOD = {
  get: `GET`,
  post: `POST`,
  put: `PUT`,
  delete: `DELETE`
};

/**
 * @description Конвертация объекта запроса в JSON
 * @param {Response} response Объект запроса
 * @return {JSON}
 */
const toJSON = (response) => {
  return response.json();
};

/**
 * @description Класс для взаимодействия с сервером
 * @export
 * @class LoaderData
 */
export default class LoaderData {
  /**
   * @description Кончтруктор класса LoaderData
   * @param {String} endPoint URL сервера
   * @param {String} authorization Данные для авторизации
   * @member LoaderData
   */
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  /**
   * @description Запрос данных всех точек маршрута
   * @return {JSON} Данные в JSON-формате
   * @member LoaderData
   */
  getPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(Adapter.parsePoints);
  }

  /**
   * @description Запрос справочника пунктов назначения
   * @return {JSON} Данные в JSON-формате
   * @member LoaderData
   */
  getDestinations() {
    return this._load({url: `destinations`})
      .then(toJSON);
  }

  /**
   * @description Запрос справочника предложений к точкам маршрута
   * @return {JSON} Данные в JSON-формате
   * @member LoaderData
   */
  getOffers() {
    return this._load({url: `offers`})
      .then(toJSON);
  }

  /**
   * @description Запрос к серверу на запись новой точки маршрута
   * @param {*} {point} Данные точки маршрута
   * @return {JSON} Ответ сервера
   * @member LoaderData
   */
  createPoint({point}) {
    return this._load({
      url: `points`,
      method: METHOD.post,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(Adapter.parsePoint);
  }

  /**
   * @description Запрос к серверу на обновление данных точки маршрута
   * @param {String} id Идентификатор точки маршрута
   * @param {Object} data Данные точки маршрута
   * @return {JSON} Ответ сервера
   * @member LoaderData
   */
  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: METHOD.put,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(Adapter.parsePoint);
  }

  /**
   * @description Запрос к серверу на удаление точки маршрута
   * @param {String} id Идентификатор точки маршрута
   * @return {Promise}
   * @member LoaderData
   */
  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: METHOD.delete});
  }

  /**
   * @description Синхронизация данных точек маршрута между сервером и Local-хранилищем
   * @param {Array} {points} Массив точек для синхронизации
   * @return {JSON}
   * @member LoaderData
   */
  syncPoints({points}) {
    return this._load({
      url: `points/sync`,
      method: METHOD.post,
      body: JSON.stringify(points),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  /**
   * @description Создание запроса к серверу
   * @param {Object} params Параметры запроса
   * @param {String} params.url Путь
   * @param {String} [params.method=METHODS.get]
   * @param {*} [params.body=null]
   * @param {Headers} [params.headers=new Headers()]
   * @return {Promise}
   * @member LoaderData
   */
  _load({url, method = METHOD.get, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this.checkStatus)
      .catch((err) => {
        window.console.error(`fetch error: ${err}`);
        throw err;
      });
  }

  /**
   * @description Проверка статуса запроса
   * @param {Response} response Объект запроса
   * @return {Response} Объект запроса, если ответ в перечне 2**
   * @member LoaderData
   */
  static checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }
}
