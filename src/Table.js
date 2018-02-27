import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { num, link } from './helpers/general';

@observer
export default class Table extends Component {
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
              <td><a href="#a" onClick={() => link(`https://finance.yahoo.com/quote/${d.symbol}`)}>{d.symbol}</a></td>
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

