export default class ModelDestination {
  constructor(data) {
    this.destination = data[`name`] || ``;
    this.description = data[`description`] || ``;
    this.pictures = data[`pictures`] || [];
  }

  static parseDestination(data) {
    return new ModelDestination(data);
  }

  static parseDestinations(data) {
    return data.map(ModelDestination.parseDestination);
  }
}
