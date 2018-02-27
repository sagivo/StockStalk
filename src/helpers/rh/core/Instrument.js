import Request from './Request';
const byId = {};
const bySymbol = {};

export default class Instrument {
  static get all() {
    return Request.get(`instruments`)
  }

  static async valueBySymbol(symbol) {
    if (!bySymbol[symbol]) {
      const instrument = (await Request.get('instruments', { symbol })).results[0];
      bySymbol[symbol] = instrument;
      byId[instrument.id] = instrument;
    }
    return bySymbol[symbol];
  }

  static async valueById(id) {
    if (!byId[id]) {
      const instrument = await Request.get(`instruments/${id}`);
      byId[id] = instrument;
      bySymbol[instrument.symbol] = instrument;
    }
    return byId[id];
  }

  constructor(id) {
    this.id = id;
  }

  async value() {
    if (!this._value) {
      this._value = await Request.get(`instruments/${this.id}`);
    }
    return this._value;
  }
}
