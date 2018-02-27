import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class Background extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div>
        BG!
      </div>
    );
  }
}

export default Background;
