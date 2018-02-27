import Request from './Request';
import Order from './Order';
import Account from './Account';

export default class Stock {
  static get span() {
    return { day: 'day', month: 'month', year: 'year', fiveYears: '5years' };
  }

  constructor(symbols) {
    this.symbols = symbols.toUpperCase();
    this.instruments = {};
  }

  get quote() {
    return Request.get('quotes', { symbols: this.symbols } );
  }

  async makeOrder(params) {
    const orderParams = await this.getOrderParams();
    return Order.place(Object.assign(orderParams, params));
  }

  // basic
  async buy(quantity, extraParams = {}) {
    const price = (await this.quote).results[0].last_trade_price;
    return this.makeOrder(Object.assign({
      quantity,
      price,
      side: 'buy',
    }, extraParams));
  }

  async sell(quantity, extraParams = {}) {
    const price = (await this.quote).results[0].last_trade_price;
    return this.makeOrder(Object.assign({
      quantity,
      price,
      side: 'sell',
    }, extraParams));
  }

  // limit
  async buyLimit(quantity, price, extraParams = {}) {
    return this.makeOrder(Object.assign({
      quantity,
      price,
      side: 'buy',
      type: 'limit',
    }, extraParams));
  }

  async sellLimit(quantity, price, extraParams = {}) {
    return this.makeOrder(Object.assign({
      quantity,
      price,
      side: 'sell',
      type: 'limit',
    }, extraParams));
  }

  // stop loss
  async stopLossSell(quantity, stopPrice, extraParams = {}) {
    return this.makeOrder(Object.assign({
      quantity,
      side: 'sell',
      trigger: 'stop',
      stop_price: stopPrice,
    }, extraParams));
  }

  async stopLossBuy(quantity, price, extraParams = {}) {
    return this.makeOrder(Object.assign({
      quantity,
      side: 'buy',
      trigger: 'stop',
      price,
      stop_price: price,
    }));
  }

  // stop loss + limit
  async stopLossSellLimit(quantity, stopPrice, sellPrice, extraParams = {}) {
    return this.makeOrder(Object.assign({
      quantity,
      side: 'sell',
      type: 'limit',
      trigger: 'stop',
      price: sellPrice,
      stop_price: stopPrice,
    }, extraParams));
  }

  async stopLossBuyLimit(quantity, stopPrice, buyPrice, extraParams = {}) {
    return this.makeOrder(Object.assign({
      quantity,
      side: 'buy',
      type: 'limit',
      trigger: 'stop',
      price: buyPrice,
      stop_price: stopPrice,
    }));
  }

  // helper
  async getOrderParams() {
    return {
      instrument: (await this.instrument()).results[0].url,
      account: await Account.url(),
      symbol: this.symbols.split(',')[0],
    };
  }
}

