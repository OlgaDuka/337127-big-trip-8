export default class ModelDestination {
  constructor(data) {
    this.destination = data[`name`] || ``;
    this.description = data[`description`] || ``;
    this.picture = data[`pictures`].src || [];
  }

  static parsePoint(data) {
    return new ModelDestination(data);
  }

  static parsePoints(data) {
    return data.map(ModelDestination.parsePoint);
  }
}
