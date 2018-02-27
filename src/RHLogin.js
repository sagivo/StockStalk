import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { link } from './helpers/general';

@inject('store') @observer
export default class RHLOGIN extends Component {
  constructor(props) {
    super(props);

    this.state = { email: '', password: '', mfa: '', needMfa: false, error: null };

    this.showErr = this.showErr.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  navigate(to) {
    this.props.store.userStore.link(to);
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ ...this.state, error: null });
    const res = await this.props.store.userStore.setToken(this.state.email, this.state.password, this.state.mfa);
    if (!res || res.error) {
      return this.setState({ ...this.state, error: 'Unable to login. Please make sure your Robinhood email & password are correct.' });
    }
    if (res['mfa_required']) return this.setState({ ...this.state, needMfa: true, error: 'Insert the additional Robinhood verification.' });
  }

  showErr(err) {
    this.setState({ ...this.state, error: err.message });
    console.log(err);
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <div id="join-container" className="">
        <h1>Success! Now, login to your Robinhood</h1>
        <div id="info">
          New? <a href="#a" onClick={() => link('https://robinhood.com/referral/sagivo/')}>create a Robinhood account for free</a>.
        </div>
        <form id="join" onSubmit={this.handleSubmit} className="justify-content-center align-items-middle">
          <div><input type="email" name="email" className="form-control" placeholder="Robinhood email" value={this.state.email} onChange={this.handleChange}  required autoFocus /></div>
          <div><input type="password" name="password" className="form-control" placeholder="Robinhood password" value={this.state.password} onChange={this.handleChange} required /></div>
          {this.state.needMfa && <div><input type="text" name="mfa" className="form-control" placeholder="Robinhood access Code" value={this.state.mfa} onChange={this.handleChange} required /></div>}
          {this.state.error && <div id="login-error">{this.state.error}</div>}
          <div><input type="submit" value="Login with Robinhood" className="btn btn-lg btn-primary btn-block" /></div>
        </form>
        <div id="agree"><span role="img" aria-label="secure">🔒</span> Secure info, syncs directly with Robinhood.</div>
      </div>
    )
  }
}
