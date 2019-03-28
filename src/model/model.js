export default class Model {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.price = data[`base_price`] || ``;
    this.timeStart = data[`date_from`];
    this.timeStop = data[`date_to`];
    this.offers = data[`offers`] || [];
    this.destination = data[`destination`].name || ``;
    this.description = data[`destination`].description || ``;
    this.picture = data[`destination`].pictures || [];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'base_price': this.price,
      'date_from': this.timeStart,
      'date_to': this.timeStop,
      'offers': this.offers,
      'destination': {name: this.destination, description: this.description, pictures: this.picture},
      'is_favorite': this.isFavorite
    };
  }

  updatePoint(pointToUpdate, newPoint) {
    const index = this.events.findIndex((it) => it === pointToUpdate);
    this.events[index] = Object.assign({}, pointToUpdate, newPoint);
    return this.events[index];
  }

  deletePoint(pointToDelete) {
    const index = this.events.findIndex((it) => it === pointToDelete);
    this.events[index].isDeleted = true;
    return this.events;
  }

  insertPoint(pointToInsert) {
    this.events.push(pointToInsert);
    const index = this.events.size - 1;
    return this.events[index];
  }

  static parsePoint(data) {
    return new Model(data);
  }

  static parsePoints(data) {
    return data.map(Model.parsePoint);
  }
}
