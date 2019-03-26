import Trip from './view/trip';
import TripOpen from './view/trip-open';
import Stat from './view/stat';
import Filter from './view/filter';

export default class Controller {
  constructor(model) {
    this._element = null;
    this.model = model;
    this.moneyStat = new Stat(this.model, 0);
    this.transportStat = new Stat(this.model, 1);
    this.timeSpendStat = new Stat(this.model, 2);

    this.controls = document.querySelector(`.trip-controls`);
    this.formFilter = this.controls.querySelector(`.trip-filter`);
    this.buttonTable = this.controls.querySelector(`a[href*=table]`);
    this.buttonStat = this.controls.querySelector(`a[href*=stats]`);
    this.boardTable = document.querySelector(`#table`);
    this.boardStat = document.querySelector(`#stats`);
    this.boardEvents = this.boardTable.querySelector(`.trip-day__items`);

    this._onFilterClick = this._onFilterClick.bind(this);
    this._onTableClick = this._onTableClick.bind(this);
    this._onStatClick = this._onStatClick.bind(this);
  }

  get element() {
    return this._element;
  }

  _onTableClick({target}) {
    if (!target.classList.contains(`view-switch__item--active`)) {
      target.classList.add(`view-switch__item--active`);
      this.buttonStat.classList.remove(`view-switch__item--active`);
      this.boardStat.classList.add(`visually-hidden`);
      this.boardTable.classList.remove(`visually-hidden`);
    }
  }

  _onStatClick({target}) {
    if (!target.classList.contains(`view-switch__item--active`)) {
      target.classList.add(`view-switch__item--active`);
      this.buttonTable.classList.remove(`view-switch__item--active`);
      this.boardStat.classList.remove(`visually-hidden`);
      this.boardTable.classList.add(`visually-hidden`);
    }
    this.moneyStat.update(this.model, 0);
    this.transportStat.update(this.model, 1);
    this.timeSpendStat.update(this.model, 2);
  }

  _onFilterClick({target}) {
    if (target.className === `trip-filter__item` && !target.previousElementSibling.disabled) {
      this.boardEvents.innerHTML = ``;
      this.renderEvents(this.model.getFilterEvents(target.previousElementSibling.id));
    }
  }

  bind() {
    this.formFilter.addEventListener(`click`, this._onFilterClick);
    this.buttonTable.addEventListener(`click`, this._onTableClick);
    this.buttonStat.addEventListener(`click`, this._onStatClick);
  }

  unbind() {
    this.formFilter.removeEventListener(`click`, this._onFilterClick);
    this.buttonTable.removeEventListener(`click`, this._onTableClick);
    this.buttonStat.removeEventListener(`click`, this._onStatClick);
  }

  renderFilters(arrFilters) {
    return arrFilters.map((element) => {
      const filter = new Filter(element);
      this.formFilter.appendChild(filter.render());
      filter.onFilter = () => {
        filter.checked = !filter.checked;
      };
    });
  }

  renderEvents(arr) {
    for (const obPoint of arr) {
      const point = new Trip(obPoint);
      const pointOpen = new TripOpen(obPoint);
      this.boardEvents.appendChild(point.render());
      point.onClick = () => {
        pointOpen.render();
        this.boardEvents.replaceChild(pointOpen.element, point.element);
        point.unrender();
      };
      pointOpen.onSubmit = (newObject) => {
        point.update(this.model.updatePoint(obPoint, newObject));
        point.render();
        this.boardEvents.replaceChild(point.element, pointOpen.element);
        pointOpen.unrender();
      };
      pointOpen.onDelete = () => {
        this.model.deletePoint(obPoint);
        this.boardEvents.removeChild(pointOpen.element);
        pointOpen.unrender();
      };
      pointOpen.onKeyEsc = () => {
        point.render();
        this.boardEvents.replaceChild(point.element, pointOpen.element);
        pointOpen.unrender();
      };
    }
  }
}
