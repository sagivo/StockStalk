import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import RH from './helpers/rh/index';

@inject('store') @observer
export default class Popular extends Component {
  constructor(props) {
    super(props);

    this.state = { stocks: [] };

    this.loadData = this.loadData.bind(this);

    this.loadData();
  }

  async loadData() {
    const rh = new RH();

    const stocks = await rh.Stock.popular();
    this.setState({ ...this.state, stocks });
  }


  render() {
    const { stocks } = this.state;
    return (
      <div id="popular">
        <table className="table table-hover" id="properties-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Symbol</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(d => (
              <tr key={d.index}>
                <td>{d.index + 1}</td>
                <td>{d.symbol}</td>
                <td>{d.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

