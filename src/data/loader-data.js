import Adapter from './adapter';

const AUTHORIZATION = `Basic dXNfckBgYXuzd27yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const METHOD = {
  get: `GET`,
  post: `POST`,
  put: `PUT`,
  delete: `DELETE`
};

const toJSON = (response) => {
  return response.json();
};

export default class LoaderData {
  constructor() {
    this._endPoint = END_POINT;
    this._authorization = AUTHORIZATION;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(Adapter.parsePoints);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(toJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(toJSON);
  }

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

  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: METHOD.delete});
  }

  syncPoints({points}) {
    return this._load({
      url: `points/sync`,
      method: METHOD.post,
      body: JSON.stringify(points),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  _load({url, method = METHOD.get, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this.checkStatus)
      .catch((err) => {
        window.console.error(`fetch error: ${err}`);
        throw err;
      });
  }

  static checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }
}
