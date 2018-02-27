import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { auth } from './helpers/firebase';
import { link } from './helpers/general';

@inject('store') @observer
export default class LOGIN extends Component {
  constructor(props) {
    super(props);

    this.state = { email: '', password: '', error: null };

    this.showErr = this.showErr.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  navigate(to) {
    this.props.store.userStore.link(to);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ ...this.state, error: null })

    if (this.props.store.userStore.page === 'LOGIN') {
      auth.signInWithEmailAndPassword(this.state.email, this.state.password).catch(this.showErr);
    } else {
      auth.createUserWithEmailAndPassword(this.state.email, this.state.password).catch(this.showErr);
    }
  }

  showErr(err) {
    this.setState({ ...this.state, error: err.message })
    console.log(err);
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { page } = this.props.store.userStore;

    return (
      <div id="join-container">
        <h1>{page === 'LOGIN' ? 'Sign with your' : 'Create a'} Stock Stalk account</h1>
        <div id="info">
          Password should be different than your robinhood password.
        </div>
        <form id="join" onSubmit={this.handleSubmit} className="justify-content-center align-items-middle">
          <div><input type="email" name="email" className="form-control" placeholder="Email" value={this.state.email} onChange={this.handleChange}  required autoFocus /></div>
          <div><input type="password" name="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.handleChange} required /></div>
          {this.state.error && <div id="login-error">{this.state.error}</div>}
          <div><input type="submit" value={page === 'LOGIN' ? 'Login' : 'Register'} className="btn btn-lg btn-primary btn-block" /></div>
        </form>
        <div id="agree">by registering you agree to the <a href="#a" onClick={() => link('https://www.stockstalk.club/terms')}>terms of use</a>.</div>
        <div id="switch">or <a href="#a"  onClick={() => this.navigate(page === 'LOGIN' ? 'REGISTER' : 'LOGIN')}>{page !== 'LOGIN' ? 'Login' : 'Register'}</a></div>
      </div>
    )
  }
}
