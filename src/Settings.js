import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { link } from './helpers/general';
import { auth } from './helpers/firebase';
const electron = window.require('electron');

@inject('store') @observer
export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
    this.updateMinNotificationChangePercent = this.updateMinNotificationChangePercent.bind(this);
    this.updateMinNotificationTriggerMinute = this.updateMinNotificationTriggerMinute.bind(this);
  }

  logout() {
    this.props.store.userStore.token = null;
    this.props.store.userStore.enabledNotifications = true;
    auth.signOut();
  }

  quit() {
    electron.remote.app.quit();
  }

  updateInterval(e) {
    let val = parseInt(e.target.value, 10);
    if (!val || val < 1) val = 1;
    this.props.store.userStore.updateInterval = val;
  }

  updateMinNotificationChangePercent(e) {
    let val = parseInt(e.target.value, 10);
    if (!val || val < 1) val = 1;
    this.props.store.userStore.minNotificationChangePercent = val;
  }

  updateMinNotificationTriggerMinute(e) {
    let val = parseInt(e.target.value, 10);
    if (!val || val < 1) val = 1;
    this.props.store.userStore.minNotificationTriggerMinute = val;
  }

  render() {
    const { appVersion, notifyOnlyPositions, enabledNotifications, minNotificationTriggerMinute, minNotificationChangePercent, updateInterval } = this.props.store.userStore;

    return (
      <div id="settings" className="container">
        <h1>Settings</h1>
        <div className="form-check form-check-inline">
          <label className="form-check-label">
            <input className="form-check-input" type="checkbox"
              checked={enabledNotifications}
              onChange={() => this.props.store.userStore.enabledNotifications = !enabledNotifications}
            /> Enable desktop notifications
          </label>
        </div><br/>
        {enabledNotifications && <div>
        <div className="form-check form-check-inline">
          <label className="form-check-label">
            <input className="form-check-input" type="checkbox"
              checked={notifyOnlyPositions}
              onChange={() => this.props.store.userStore.notifyOnlyPositions = !notifyOnlyPositions}
            /> Alert me only on active positions
          </label>
        </div><br/>
        <div>
          Alert me no more than once each <input type="number" value={minNotificationTriggerMinute} min="1" onChange={this.updateMinNotificationTriggerMinute} /> minutes per stock.
        </div>
        <div>
          Alert me when stock changes more/less than <input type="number" value={minNotificationChangePercent} min="1" onChange={this.updateMinNotificationChangePercent} /> percent.
        </div>
        </div>}
        <div>
          Update stocks every <input type="number" value={updateInterval} min="1" onChange={this.updateInterval} /> seconds.
        </div>
        <div id="setting-actions">
          <button onClick={() => link('https://stockstalk.club?ref=app')} className="btn btn-primary">Homepage</button> 
          <button onClick={this.logout} className="btn btn-danger">Logout</button>
          <button onClick={this.quit} className="btn btn-danger">Exit App</button>
        </div>
        <div id="version">Version #{appVersion}</div>
      </div>
    );
  }
}
