import React, { Component } from 'react';
import { link } from './helpers/general';

export default class Stock extends Component {
  render() {
    return (
      <div id="share">
        <h1>Show Us Some ❤</h1>
        <div>Did you like the StockStalk app? Help us spread the word!</div>
        <div>Just share the link <a href="#a" onClick={() => link('https://stockstalk.club?ref=app')}>https://StockStalk.club</a> with your friends in your favoriet format.</div>
      </div>
    );
  }
}

