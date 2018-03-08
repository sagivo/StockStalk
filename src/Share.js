import React, { Component } from 'react';

export default class Stock extends Component {
  constructor(props) {
    super(props);

    window.addthis.layers.refresh();
  }

  render() {
    return (
      <div id="share">
        <h1>Show Us Some ❤</h1>
        <div>Did you like the StockStalk app? Help us spread the world!</div>
        <div className="addthis_inline_share_toolbox_jral" data-url="http://www.stockstalk.club" data-title="Robinhood for Desktop | Stock Stalk"></div>
      </div>
    );
  }
}

