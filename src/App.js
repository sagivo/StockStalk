import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Header from './Header';
import Fetcher from './Fetcher';
import Login from './Login';
import Main from './Main';
import Stock from './Stock';
import Orders from './Orders';
import Settings from './Settings';
import Popular from './Popular';
import Share from './Share';
import RHLogin from './RHLogin';
import './styles/app.css';

@inject('store') @observer
export default class App extends Component {
  render() {
    const { page } = this.props.store.userStore;

    return (
      <div>
        <Header />
        {this.props.store.userStore.user && this.props.store.userStore.token && <Fetcher />}
        {page === 'RHLOGIN' && <RHLogin />}
        {(page === 'LOGIN' || page === 'REGISTER') && <Login />}
        {page === 'MAIN' && <Main />}
        {page === 'POPULAR' && <Popular />}
        {page === 'STOCK' && <Stock />}
        {page === 'ORDERS' && <Orders />}
        {page === 'SETTINGS' && <Settings />}
        {page === 'SHARE' && <Share />}
      </div>
    );
  }
}

