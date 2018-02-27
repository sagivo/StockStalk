import Request from './Request';

export default class Order {
  static place(params) {
    if (
      !params.symbol ||
      (params.type === 'limit' && !params.price) ||
      !params.quantity ||
      !params.side ) return false;

    const defaultParams = {
      type: 'market',
      time_in_force: 'gfd',
      trigger: 'immediate',
    };

    const request = Object.assign(defaultParams, params);
    return Request.postPersonal('orders', request);
  }

  constructor(id) {
    this.id = id;
  }

  cancel(id) {
    const orderId = id || this.id;
    return Request.postPersonal(`orders/${orderId}/cancel`);
  }

  status(id) {
    const orderId = id || this.id;
    return Request.getPersonal(`orders/${orderId}`);
  }

  get recent() {
    return Request.getPersonal('orders');
  }
}
