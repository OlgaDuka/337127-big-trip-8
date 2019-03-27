export default class ModelDestination {
  constructor(data) {
    this._name = data[`name`] || ``;
    this._description = data[`description`] || ``;
    this._pictures = data[`pictures`] || [];
  }

  toRAW() {
    return {
      'name': this.name,
      'description': this.description,
      'pictures': this._pictures,
    };
  }

  static parsePoint(data) {
    return new ModelDestination(data);
  }

  static parsePoints(data) {
    return data.map(ModelDestination.parsePoint);
  }
}
