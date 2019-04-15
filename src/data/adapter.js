/**
 * @description Класс обработки данных для обмена между приложением и сервером
 * @export
 * @class Adapter
 */
export default class Adapter {
  /**
   * @description Конструктор касса Adapter
   * @param {Array} data Массив данных, получаемых с сервера
   * @member Adapter
   */
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.timeStart = data[`date_from`];
    this.timeStop = data[`date_to`];
    this.price = data[`base_price`] || 0;
    this.offers = data[`offers`] || [];
    this.destination = data[`destination`].name || ``;
    this.description = data[`destination`].description || ``;
    this.pictures = data[`destination`].pictures || [];
    this.isFavorite = Boolean(data[`is_favorite`]) || false;
  }

  /**
   * @description Фабричный метод для приведения структуры данных к серверному виду
   * @static
   * @return {Object}
   * @member ModelItem
   */
  static toRAW(data) {
    return {
      'id': data.id,
      'type': data.type,
      'date_from': data.timeStart,
      'date_to': data.timeStop,
      'base_price': +data.price,
      'destination': {name: data.destination, description: data.description, pictures: data.pictures},
      'is_favorite': data.isFavorite,
      'offers': data.offers
    };
  }

  /**
   * @description Фабричный метод разбора данных
   * @static
   * @param {Array} data Массив данных
   * @return {Adapter} Объект класса Adapter с адаптированными под приложение данными
   * @member Adapter
   */
  static parsePoint(data) {
    return new Adapter(data);
  }
  
  /**
   * @description Фабричный метод разбора группы данных
   * @static
   * @param {Array} data Массив данных
   * @return {Array} Массив объектов класса Adapter
   * @member Adapter
   */
  static parsePoints(data) {
    return data.map(Adapter.parsePoint);
  }
}
