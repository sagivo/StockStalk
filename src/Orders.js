import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { num } from './helpers/general';
import RH from './helpers/rh/index';

@inject('store') @observer
export default class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = { orders: [] };

    this.cancel = this.cancel.bind(this);
    this.getOrders = this.getOrders.bind(this);
  }

  componentDidMount() {
    this.getOrders()
    this.setState({ ...this.state, interval: setInterval(this.getOrders, 5000)});
  }

  async cancel(id) {
    const rh = new RH();
    const order = new rh.Order();
    await order.cancel(id);
    setTimeout(() => this.getOrders(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  async getOrders() {
    const rh = new RH();
    const order = new rh.Order();
    const Instrument = rh.Instrument;
    const res = await order.recent

    const calls = res.results.map(d => async () => {
      const instrumentId = d.instrument.split('/').slice(-2)[0];
      const instrument = await Instrument.valueById(instrumentId);
      d.symbol = instrument.symbol;
      return d;
    });

    const orders = await Promise.all(calls.map(c=> c()));

    this.setState({ ...this.state, orders });
  }

  render() {
    const { orders } = this.state;
    return (
      <div id="orders">
        <table className="table table-hover" id="properties-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Fees</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(d => (
              <tr key={d.id}>
                <td>{d.side}</td>
                <td>{d.symbol}</td>
                <td>{d.trigger === 'stop' ? 'stop' : d.type}</td>
                <td>{num(d.quantity, { before: '$', noSymbol: true })}</td>
                <td>{num(d.average_price || d.price, { before: '$', noSymbol: true })}</td>
                <td>{d.fees}</td>
                {!(d.state === 'queued' || d.state === 'confirmed') && <td>{d.state}</td>}
                {(d.state === 'queued' || d.state === 'confirmed') && <td><button onClick={() => this.cancel(d.id)}>cancel</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

