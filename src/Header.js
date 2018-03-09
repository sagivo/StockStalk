import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { num, link } from './helpers/general';
import CountUp from 'react-countup';
import icon from './images/icon.png'
const { ipcRenderer } = window.require('electron');

@inject('store') @observer
export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = { prevEquity: 0 };

    ipcRenderer.on('newVersion', (event, text) => {
      this.props.store.userStore.newVersion = true;
    });

    this.updateVersion = this.updateVersion.bind(this);
  }

  navigate(to) {
    this.props.store.userStore.link(to);
  }

  updateVersion() {
    this.props.store.userStore.newVersion = false;
    ipcRenderer.send('msg', { type: 'updateVersion' });
  }

  render() {
    const { userStore } = this.props.store;
    const { page } = userStore;

    return (
      <div id="header">
        {this.props.store.userStore.newVersion && <div id="update-version"><a href="#a" onClick={this.updateVersion} className="summeryNum">UPDATE VERSION</a></div>}
        <span id="logo">
          <a href="#a" onClick={() => link('https://stockstalk.club?ref=app')}><img src={icon} alt="StockStalk"/></a>
          {userStore.user && userStore.portfolio.equity && <CountUp
            className="summeryNum"
            start={this.props.store.userStore.prevEquity}
            end={userStore.portfolio.equity}
            prefix="$"
            duration={.5}
            useEasing={true}
            useGrouping={true}
            separator=","
            decimals={2}
            decimal="."
          />}
        </span>
        <ul id="login-header" className="float-right">
          {userStore.user && userStore.token && <li>{(page === 'MAIN') ? 'Main' : <a href="#a" onClick={() => this.navigate('MAIN')}>Main</a>}</li>}
          {userStore.user && userStore.token && <li>{(page === 'ORDERS') ? 'Orders' : <a href="#a" onClick={() => this.navigate('ORDERS')}>Orders</a>}</li>}
          {userStore.user && userStore.token && <li>{(page === 'POPULAR') ? 'Popular' : <a href="#a" onClick={() => this.navigate('POPULAR')}>Popular</a>}</li>}
          {userStore.user && userStore.token && <li>{(page === 'SHARE') ? 'Share' : <a href="#a" onClick={() => this.navigate('SHARE')}>Share</a>}</li>}
          {(userStore.user && !userStore.token) && <li>{(page === 'RHLOGIN') ? 'Login to Robinhood' : <a href="#a" onClick={() => this.navigate('RHLOGIN')}>Login to Robinhood</a>}</li>}
          {userStore.user && <li>{(page === 'SETTINGS') ? 'Settings' : <a href="#a" onClick={() => this.navigate('SETTINGS')}>Settings</a>}</li>}
        </ul>
        {userStore.portfolio.equity && <div id="today">
          <span className={userStore.portfolio.todayChange >= 0 ? 'up' : 'down'}>{num(userStore.portfolio.todayChange, {before: "$" })} ({num(userStore.portfolio.todayChangePercent, {after: "%" })})</span> 
          Today</div>}
      </div>
    )
  }
}
