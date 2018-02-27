import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { num, link } from './helpers/general';

@observer
export default class Watchilist extends Component {
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
          {this.props.data.map(d => (
            <tr key={d.symbol}>
              <td><a href="#a" onClick={() => link(`https://finance.yahoo.com/quote/${d.symbol}`)}>{d.symbol}</a></td>
              <td>{num(d.last_trade_price, { before: '$', noSymbol: true })}</td>
              <td className={d.todayChangePercent >= 0 ? 'up' : 'down'}>{num(d.todayChangePercent, {after: "%" })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
