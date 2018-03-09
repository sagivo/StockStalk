import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { num } from './helpers/general';

@inject('store') @observer
export default class Watchilist extends Component {
  constructor(props) {
    super(props);

    this.link = this.link.bind(this)
  }

  link(stock) {
    this.props.store.userStore.selectedStock = stock.symbol;
    this.props.store.userStore.link('STOCK');
  }

  render() {
    return (
      <table className="table" id="properties-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Last Price</th>
            <th>Today Change</th>
          </tr>
        </thead>
        <tbody>
          {this.props.store.userStore.watchlist.map(d => (
            <tr key={d.symbol}>
              <td><a href="#a" onClick={() => this.link(d)}>{d.symbol}</a></td>
              <td>{num(d.last_trade_price, { before: '$', noSymbol: true })}</td>
              <td className={d.todayChangePercent >= 0 ? 'up' : 'down'}>{num(d.todayChangePercent, {after: "%" })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
