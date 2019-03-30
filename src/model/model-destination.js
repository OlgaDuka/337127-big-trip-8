export default class ModelDestination {
  constructor(data) {
    this.title = data[`name`] || ``;
    this.description = data[`description`] || ``;
    this.picture = data[`pictures`].src || [];
  }

  static parseDestination(data) {
    return new ModelDestination(data);
  }

  static parseDestinations(data) {
    return data.map(ModelDestination.parseDestination);
  }
}
