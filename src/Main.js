import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Table from './Table';
import Watchilist from './Watchilist';

@inject('store') @observer
export default class Main extends Component {
  render() {
    const { userStore } = this.props.store;
    if (!userStore.positions || !userStore.portfolio.todayChange) return <div>Loading...</div>;

    return (
      <div id="main-container">
        {userStore.positions.length && <Table data={userStore.positions}/>}
        {userStore.watchlist.length && <div>
          <h1>Watchlist</h1>
          <Watchilist data={userStore.watchlist}/>
        </div>
        }
      </div>
    );
  }
}

