import Adapter from './adapter';

export default class Provider {
  constructor({loaderData, store, generateId}) {
    this._loader = loaderData;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;

    this._sendStorage = this._sendStorage.bind(this);
  }

  getPoints() {
    if (Provider.isOnline()) {
      return this._loader.getPoints()
        .then((points) => {
          points.forEach(this._sendStorage);
          return points;
        });
    } else {
      const rawPointsMap = this._store.getAll();
      const rawPoints = Provider.objectToArray(rawPointsMap);
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

  updatePoint({id, data}) {
    if (Provider.isOnline()) {
      return this._loader.updatePoint({id, data})
        .then(this._sendStorage);
    } else {
      const point = Adapter.parsePoint(point);
      this._needSync = true;
      this._sendStorage(point);
      return Promise.resolve(point);
    }
  }

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

  _sendStorage(point) {
    this._store.setItem({
      id: point.id,
      item: Adapter.toRAW(point)
    });
    return point;
  }

  syncPoints() {
    return this._loader.syncPoints({
      points: Provider.objectToArray(this._store.getAll())
    })
    .then(() => {
      this._needSync = false;
    });
  }

  static isOnline() {
    return window.navigator.onLine;
  }

  static objectToArray(object) {
    return Object.keys(object).map((id) => object[id]);
  }

}
