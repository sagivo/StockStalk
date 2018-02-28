import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { num } from './helpers/general';

@inject('store') @observer
export default class Table extends Component {
  constructor(props) {
    super(props);

    this.link = this.link.bind(this)
  }

  link(stock) {
    this.props.store.userStore.stock = stock;
    this.props.store.userStore.link('STOCK');
  }
  render() {
    return (
      <table className="table table-hover" id="properties-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Last Price</th>
            <th>Equity</th>
            <th>Today Change</th>
            <th>Total Change</th>
          </tr>
        </thead>
        <tbody>
          {this.props.data.map(d => (
            <tr key={d.symbol}>
              <td><a href="#a" onClick={() => this.link(d)}>{d.symbol}</a></td>
              <td>{num(d.last_trade_price, { before: '$', noSymbol: true })}</td>
              <td>{num(d.equity, { before: '$', noSymbol: true })}</td>
              <td className={d.todayChange >= 0 ? 'up' : 'down'}>{num(d.todayChange, {before: "$" })} ({num(d.todayChangePercent, {after: "%" })})</td>
              <td className={d.totalChange >= 0 ? 'up' : 'down'}>{num(d.totalChange, {before: "$" })} ({num(d.totalChangePercent, {after: "%" })})</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

