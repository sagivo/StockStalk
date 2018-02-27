import React, { Component } from 'react';
import { num } from './helpers/general';

export default class Indicator extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    const value = parseFloat(this.props.value);
    const { before, after } = this.props;
    const isUp = value >= 0;

    return (!isNaN(value) &&
      <span className={isUp ? 'up' :  'down'}>
         {num(value, { before, after })}
      </span>
    );
  }
}
