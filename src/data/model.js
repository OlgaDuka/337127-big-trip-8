import * as util from '../utils/index';
import moment from 'moment';
import TotalCost from '../view/total-cost';

/**
 * @description Класс для хранения и манипулирования данными приложения во время его работы
 * @export
 * @class Model
 */
export default class Model {
  /**
   * @description Конструктор касса Model
   * @description При создании модель содержит только статические данные, затем принимает данные с сервера
   * @member Model
   */
  constructor() {
    this._events = [];
    this._destinations = [];
    this._offers = [];
    this.filters = util.NAME_FILTERS;
    this.sorting = util.NAME_SORTING;
    this.stat = util.StatData;
    this.state = {
      nameFilter: `filter-everything`,
      nameSorting: `sorting-event`
    };
  }
  /**
   * @description Сеттер - помещает данные точек маршрута в модель
   * @param {Array} data массив объектов данных всех точек маршрута, полученных с сервера
   * @member Model
   */
  set eventsData(data) {
    this._events = data;
  }

  /**
   * @description Сеттер - помещает данные справочника пунктов назначения в модель
   * @param {Array} data массив объектов справочника пунктов назначения, полученных с сервера
   * @member Model
   */
  set destinationsData(data) {
    this._destinations = data;
  }

  /**
   * @description Сеттер - помещает данные справочника предложений к точкам маршрута в модель
   * @param {Array} data массив объектов справочника предложений к точкам маршрута, полученных с сервера
   * @member Model
   */
  set offersData(data) {
    this._offers = data;
  }

  /**
   * @description Геттер - предоставляет данные точек маршрута приложению для работы
   * @return {Array} data массив объектов данных всех точек маршрута
   * @member Model
   */
  get events() {
    return this._events;
  }

  /**
   * @description Геттер - предоставляет данные справочника пунктов назначения приложению для работы
   * @return {Array} data массив объектов данных справочника пунктов назначения
   * @member Model
   */
  get destinations() {
    return this._destinations;
  }

  /**
   * @description Геттер - предоставляет данные справочника предложений к точкам маршрута приложению для работы
   * @return {Array} data массив объектов данных справочника предложений к точкам маршрута
   * @member Model
   */
  get offers() {
    return this._offers;
  }

  /**
   * @description Выбирает по имени и применяет к массиву точек маршрута функцию фильтрации
   * @const {Enum} FnFilter функции фильтрации точек маршрута
   * @return {Function} FnFilter функция, выполняется в момент возврата
   * @member Model
   */
  getFilterSortingEvents() {
    let arrResult = this.events.slice();
    const FnFilter = {
      'filter-everything': () => {
        return arrResult;
      },
      'filter-future': () => {
        return arrResult.filter((it) => it.timeStart > Date.now());
      },
      'filter-past': () => {
        return arrResult.filter((it) => it.timeStop < Date.now());
      }
    };
    const FnSorting = {
      'sorting-event': () => {
        return arrResult;
      },
      'sorting-time': () => {
        return arrResult.sort((a, b) => Model.duration(a) - Model.duration(b)).reverse();
      },
      'sorting-price': () => {
        return arrResult.sort((a, b) => TotalCost.getPricePoint(a) - TotalCost.getPricePoint(b)).reverse();
      }
    };
    arrResult = FnFilter[this.state.nameFilter]();
    arrResult = FnSorting[this.state.nameSorting]();
    return arrResult;
  }

  /**
   * @description Выбирает по имени и применяет к массиву точек маршрута функцию сортировки
   * @param {String} sortingName имя функции сортировки
   * @const {Enum} FnSorting функции сортировки точек маршрута
   * @return {Function} FnSorting функция, выполняется в момент возврата
   * @member Model
   */
  getSortingEvents(sortingName) {
    let arrResult = [];
    if (this._state.nameFilter === `filter-everything`) {
      arrResult = this.events.slice();
    } else {
      arrResult = this.events.this.getFilterEvents(this._state.nameFilter).slice();
    }
    const FnSorting = {
      'sorting-event': () => {
        return this.events;
      },
      'sorting-time': () => {
        return arrResult.sort((a, b) => Model.duration(a) - Model.duration(b)).reverse();
      },
      'sorting-price': () => {
        return arrResult.sort((a, b) => TotalCost.getPricePoint(a) - TotalCost.getPricePoint(b)).reverse();
      }
    };
    this._state.nameSorting = sortingName;
    return FnSorting[sortingName]();
  }

  /**
   * @description Обновляет данные точки маршрута
   * @param {Object} pointToUpdate точка маршрута, которую надо обновить
   * @param {Object} newPoint новые данные для точки маршрута
   * @const {String} index ID точки маршрута, которую надо обновить
   * @return {Array} this._events массив объектов данных всех точек маршрута
   * @member Model
   */
  updatePoint(pointToUpdate, newPoint) {
    const index = pointToUpdate.id;
    this._events[index] = Object.assign({}, newPoint);
    return this._events;
  }
  /**
   * @description Фабричный метод для вычисления длительности временного промежутка
   * @static
   * @param {Object} obEvent точка маршрута
   * @return {Integer} длительность в миллисекундах
   * @member Model
   */
  static duration(obEvent) {
    return moment.duration(moment(obEvent.timeStop).diff(moment(obEvent.timeStart)));
  }
}
