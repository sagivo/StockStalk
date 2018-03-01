import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { num, link } from './helpers/general';
import RH from './helpers/rh/index';

@inject('store') @observer
export default class Stock extends Component {
  constructor(props) {
    super(props);

    this.state = { side: 'buy', orderType: 'market', shares: '', limitPrice: '', stopPrice: '', showAdvanced: false, time: 'gfd' };

    this.setShares = this.setShares.bind(this);
    this.setLimitPrice = this.setLimitPrice.bind(this);
    this.setOrderType = this.setOrderType.bind(this);
    this.setStopPrice = this.setStopPrice.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  setShares(e) {
    this.setState({ ...this.state, shares: e.target.value })
  }

  setLimitPrice(e) {
    this.setState({ ...this.state, limitPrice: e.target.value })
  }

  setStopPrice(e) {
    this.setState({ ...this.state, stopPrice: e.target.value })
  }

  setOrderType(orderType) {
    this.setState({ ...this.state, orderType })
  }

  async placeOrder() {
    const rh = new RH();
    const account = await rh.Account.url();
    const { stock } = this.props.store.userStore;
    let params = {
      account,
      symbol: stock.symbol,
      instrument: stock.instrument,
      side: this.state.side,
      quantity: this.state.shares,
      time_in_force: this.state.time,
    }

    if (this.state.orderType === 'market') params = { ...params,
      type: 'market',
      trigger: 'immediate',
      price: stock.last,
    }

    if (this.state.orderType === 'limit') params = { ...params,
      type: 'limit',
      trigger: 'immediate',
      price: this.state.limitPrice,
    }

    if (this.state.orderType === 'stop') params = { ...params,
      type: 'market',
      trigger: 'stop',
      stop_price: this.state.stopPrice,
      price: stock.last,
    }

    if (this.state.orderType === 'stopLimit') params = { ...params,
      type: 'limit',
      trigger: 'stop',
      stop_price: this.state.stopPrice,
      price: this.state.limitPrice,
    }

    const res = await rh.Order.place(params);
    this.props.store.userStore.link('ORDERS')
  }

  render() {
    const { stock } = this.props.store.userStore;
    let total;
    if (this.state.orderType === 'market') total = stock.last * this.state.shares;
    if (this.state.orderType === 'limit' || this.state.orderType === 'stopLimit') total = this.state.limitPrice * this.state.shares;
    if (this.state.orderType === 'stop') total = this.state.stopPrice * this.state.shares;

    return (
      <div id="stock">
        <h1>{stock.name}</h1>
        <div id="last-price">
          Last: {num(stock.last, { before: '$', noSymbol: true })}
          <span className={stock.todayChangePercent >= 0 ? 'up' : 'down'}>({num(stock.todayChangePercent, {after: "%" })})</span>
        </div>
        <div id="actions">
          <ul className="nav nav-tabs nav-justified">
            <li className="nav-item">
              <a className={this.state.side === 'buy' ? 'nav-link active' : 'nav-link'} onClick={() => this.setState({...this.state, side: 'buy'})} href="#a">Buy</a>
            </li>
            {parseInt(stock.quantity) > 0 && <li className="nav-item">
              <a className={this.state.side === 'sell' ? 'nav-link active' : 'nav-link'} onClick={() => this.setState({...this.state, side: 'sell'})} href="#a">Sell</a>
            </li>}

          </ul>
          <div id="options">
            <table>
              <tbody>
                <tr>
                  <td>Shares {this.state.side === 'sell' ? `(${parseInt(stock.quantity)} max)` : ''}</td>
                  <td><input type="number" min="1" value={this.state.shares} onChange={this.setShares} /></td>
                </tr>

                {this.state.orderType.startsWith('stop') && <tr>
                  <td>Stop price</td>
                  <td><input type="number" min="0" value={this.state.stopPrice} onChange={this.setStopPrice} /></td>
                </tr>}
                {(this.state.orderType === 'limit' || this.state.orderType === 'stopLimit') && <tr>
                  <td>Limit price</td>
                  <td><input type="number" min="0" value={this.state.limitPrice} onChange={this.setLimitPrice} /></td>
                </tr>}
                <tr><td colSpan="2"><a href="#a" onClick={() => this.setState({ ...this.state, showAdvanced: !this.state.showAdvanced})}>{this.state.showAdvanced ? '▾' : '›' } Advanced</a></td></tr>

                {this.state.showAdvanced && <tr>
                  <td>Order type</td>
                  <td>
                    <select value={this.state.orderType} className="custom-select" onChange={e => this.setState({ ...this.state, orderType: e.target.value })}>
                      <option value="market">Market</option>
                      <option value="limit">Limit</option>
                      <option value="stop">Stop</option>
                      <option value="stopLimit">Stop Limit</option>
                    </select>
                  </td>
                </tr>}
                {this.state.showAdvanced && <tr>
                  <td>Good for</td>
                  <td>
                    <select className="custom-select" value={this.state.time} onChange={e => this.setState({ ...this.state, time: e.target.value })}>
                      <option value="gfd">Today</option>
                      <option value="gtc">Never Expires</option>
                    </select>
                  </td>
                </tr>}
                <tr>
                  <td>Estimated total</td>
                  <td>{num(total, { before: '$', noSymbol: true })}</td>
                </tr>
              </tbody>
            </table>
            <button className="btn btn-primary btn-lg" onClick={this.placeOrder}>{this.state.side === "buy" ? 'BUY' : 'SELL'} {this.props.store.userStore.stock.symbol}</button>
          </div>
        </div>
      </div>
    );
  }
}

