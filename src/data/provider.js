import Adapter from './adapter';

export default class Provider {
  constructor({loaderData, store, generateId}) {
    this._loader = loaderData;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;

    this._sendStorage = this._sendStorage.bind(this);
  }

  _sendStorage(point) {
    this._store.setItem({
      id: point.id,
      item: Adapter.toRAW(point)
    });
    return point;
  }

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
      const point = Adapter.parsePoint(data);
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
