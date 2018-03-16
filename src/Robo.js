import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

@inject('store') @observer
export default class Stock extends Component {
  constructor(props) {
    super(props);

    this.signForRobo = this.signForRobo.bind(this);
  }

  signForRobo() {
    this.props.store.userStore.signForRobo();
  }

  render() {
    const { user } = this.props.store.userStore;
    return (
      <div id="robo">
        <h1><span role="img" aria-label="robot">🤖</span> Robo Trading <span role="img" aria-label="robot">🤖</span></h1>
        <h5>Sleeping? On a vaction? Let the robots trade for you.</h5>
        <div>✓ 24/7 stock monitoring and trading</div>
        <div>✓ Automatic buy&sell triggers</div>
        <div>✓ Define your trading strategy</div>
        <div>✓ Traidivng stop</div>
        <div>✓ Moving avarage</div>
        <h5>Take investing into the next level for only $10/month</h5>
        {user && !user.isSignForRobo && <div><button className="btn btn-primary" onClick={this.signForRobo}>SIGN FOR EARLY ACCESS</button></div>}
        {user && user.isSignForRobo && <div id="onlist">You are on the waitlist!</div>}
      </div>
    );
  }
}

