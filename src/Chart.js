import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
const ReactHighcharts = require('react-highcharts')

@inject('store') @observer
export default class Header extends Component {
  render() {
    return (
      <div id="main-chart">
        <ReactHighcharts config={this.props.config}/>
      </div>
    )
  }
}
