import Adapter from './adapter';

export default class Provider {
  constructor({loader, store, generateId}) {
    this._loader = loader;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }

  getPoints() {
    if (this._isOnline()) {
      return this._loader.getPoints()
        .then((events) => {
          events.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
          return events;
        });
    } else {
      const rawPointsMap = this._store.getAll();
      const rawPoints = Array.from(rawPointsMap);
      const points = Adapter.parsePoints(rawPoints);

      return Promise.resolve(points);
    }
  }

  getDestinations() {
    return this._loader.getDestinations();
  }

  getOffers() {
    return this._loader.getOffers();
  }

  createPoint({point}) {
    if (this._isOnline()) {
      return this._loader.createPoint({point})
        .then(() => {
          this._store.setItem({key: point.id, item: point.toRAW()});
          return point;
        });
    } else {
      point.id = this._generateId();
      this._needSync = true;

      this._store.setItem({key: point.id, item: point});
      return Promise.resolve(Adapter.parsePoint(point));
    }
  }

  updatePoint({id, data}) {
    if (this._isOnline()) {
      return this._loader.updatePoint({id, data})
        .then((point) => {
          this._store.setItem({key: point.id, item: point.toRAW()});
          return point;
        });
    } else {
      const point = data;
      this._needSync = true;
      this._store.setItem({key: point.id, item: point});
      return Promise.resolve(Adapter.parsePoint(point));
    }
  }

  deletePoint({id}) {
    if (this._isOnline()) {
      return this._loader.deletePoint({id})
        .then(() => {
          this._store.removeItem({key: id});
        });
    } else {
      this._needSync = true;
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  syncPoints() {
    return this._loader.syncPoints({points: Array.from(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
