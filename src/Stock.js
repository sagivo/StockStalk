import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { num, getTodaty } from './helpers/general';
import RH from './helpers/rh/index';
import Chart from './Chart';

@inject('store') @observer
export default class Stock extends Component {
  constructor(props) {
    super(props);

    const stock = this.props.store.userStore.stocks.get(this.props.store.userStore.selectedStock);
    this.state = { stock, side: 'buy', orderType: 'market', shares: '', limitPrice: '', stopPrice: '', showAdvanced: false, time: 'gfd', error: null, config: null, selectedTime: 'now' };
    this.setChart('now');

    this.setShares = this.setShares.bind(this);
    this.setLimitPrice = this.setLimitPrice.bind(this);
    this.setOrderType = this.setOrderType.bind(this);
    this.setStopPrice = this.setStopPrice.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.setChart = this.setChart.bind(this);
  }

  async setChart(selectedTime) {
    try {
      const today = getTodaty();
      const time = {
        now: {name: 'TIME_SERIES_INTRADAY', row: 'Time Series (1min)', size: 'full', filter: k => k.startsWith(today) },
        day: {name: 'TIME_SERIES_DAILY', row: 'Time Series (Daily)', size: 'compact', filter: () => true },
        all: {name: 'TIME_SERIES_MONTHLY', row: 'Monthly Time Series', size: 'full', filter: () => true},
      }[selectedTime];

      const res = await fetch(`https://www.alphavantage.co/query?function=${time.name}&symbol=${this.state.stock.symbol}&interval=1min&outputsize=${time.size}&apikey=UY2TNX3E7L3LMD5K`);
      const resJson = await res.json();
      const data = Object.keys(resJson[time.row]).filter(time.filter).map(k => [new Date(k + ' EST').getTime(), parseFloat(resJson[time.row][k]['4. close'])]).reverse()
      const config = {
        time: {timezoneOffset: 0},
        rangeSelector: {
          enabled: false
        },
        xAxis: {
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        legend: {enabled: false},
        title: {text: null},
        tooltip: {
          headerFormat: null,
          formatter: function() {
              return  '<div class="point-data"><b>$' + this.point.y +'</b><br/>' + new Date(this.point.x).toLocaleString() + '</div>'
          }
        },
        scrollbar: {
          enabled: false
        },
        navigator: {
          enabled: false
        },
        chart: {
          height: '140',
        },
        series: [{
          labels: { enabled: false },
          data,
          fillColor: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, '#21ce99'],
              [1, 'white']
            ]
          },
          color: '#21ce99',
        }]
      };
      this.setState({ ...this.state, config, selectedTime });
    } catch (err) { console.error(err); }
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
    const { stock } = this.state;

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

    try {
      await rh.Order.place(params);
      this.props.store.userStore.link('ORDERS')
    } catch (err) {
      this.setState({ ...this.state, error: err.error.detail })
    }
  }

  render() {
    const { portfolio } = this.props.store.userStore;
    const { stock, selectedTime } = this.state;
    let total;
    if (this.state.orderType === 'market') total = stock.last * this.state.shares;
    if (this.state.orderType === 'limit' || this.state.orderType === 'stopLimit') total = this.state.limitPrice * this.state.shares;
    if (this.state.orderType === 'stop') total = this.state.stopPrice * this.state.shares;

    return (
      <div id="stock">
        <h1>{stock.name}</h1>
        {this.state.config && <div id="stock-chart">
          <div><a href="#a" onClick={() => this.setChart('now')} className={selectedTime === 'now' ? 'bold' : ''}>today</a> | <a href="#a" onClick={() => this.setChart('day')} className={selectedTime === 'day' ? 'bold' : ''}>6 months</a> | <a href="#a" onClick={() => this.setChart('all')} className={selectedTime === 'all' ? 'bold' : ''}>all</a></div>
          <Chart config={this.state.config} />
        </div>}
        <div id="last-price">
          <span>Last: {num(stock.last, { before: '$', noSymbol: true })}</span>
          <span className={stock.todayChangePercent >= 0 ? 'up' : 'down'}>({num(stock.todayChangePercent, {after: "%" })})</span>
          <span>Available: {num(portfolio.buyingPower, { before: '$', noSymbol: true })}</span>
        </div>
        <div id="actions">
          <ul className="nav nav-tabs nav-justified">
            <li className="nav-item">
              <a className={this.state.side === 'buy' ? 'nav-link active' : 'nav-link'} onClick={() => this.setState({...this.state, side: 'buy'})} href="#a">Buy</a>
            </li>
            {parseInt(stock.quantity, 10) > 0 && <li className="nav-item">
              <a className={this.state.side === 'sell' ? 'nav-link active' : 'nav-link'} onClick={() => this.setState({...this.state, side: 'sell'})} href="#a">Sell</a>
            </li>}

          </ul>
          <div id="options">
            <table>
              <tbody>
                <tr>
                  <td>Shares {this.state.side === 'sell' ? `(${parseInt(stock.quantity, 10)} max)` : ''}</td>
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
            <div id="action-error">{this.state.error}</div>
            <button className="btn btn-primary btn-lg" onClick={this.placeOrder}>{this.state.side === "buy" ? 'BUY' : 'SELL'} {stock.symbol}</button>
          </div>
        </div>
      </div>
    );
  }
}

