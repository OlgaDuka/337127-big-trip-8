import Adapter from './adapter';

const AUTHORIZATION = `Basic dXNfckBgYXuzd27yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const toJSON = (response) => {
  return response.json();
};

export default class LoaderData {
  constructor() {
    this._endPoint = END_POINT;
    this._authorization = AUTHORIZATION;
    this._method = {
      GET: `GET`,
      POST: `POST`,
      PUT: `PUT`,
      DELETE: `DELETE`
    };
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
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
      method: this._method.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(Adapter.parsePoint);
  }

  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: this._method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(Adapter.parsePoint);
  }

  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: this._method.DELETE});
  }

  syncPoints({points}) {
    return this._load({
      url: `points/sync`,
      method: this._method.POST,
      body: JSON.stringify(points),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  _load({url, method = this._method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this.checkStatus)
      .catch((err) => {
        window.console.error(`fetch error: ${err}`);
        throw err;
      });
  }
}
