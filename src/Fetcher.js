import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observe } from 'mobx';
import { num, notify } from './helpers/general';
import upImg from './images/up.png';
import downImg from './images/down.png';

const { ipcRenderer } = window.require('electron');
const { app } = window.require('electron').remote;
const Jimp = window.require('jimp');
const trayImagePath = app.getPath('userData') + '/tray.png';

@inject('store') @observer
export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = { intervals: [] };

    ipcRenderer.on('message', (event, text) => {
      console.log(text);
    })

    this.updateStocks = this.updateStocks.bind(this);
    this.updatePositions = this.updatePositions.bind(this);
    this.renderUpdate = this.renderUpdate.bind(this);
    this.checkAlerts = this.checkAlerts.bind(this);
  }

  updatePositions() {
    return this.props.store.userStore.updatePositions();
  }

  updateStocks() {
    return this.props.store.userStore.updateStocks();
  }

  renderUpdate() {
    const positions = this.props.store.userStore.positions.slice().map(p => ({
      symbol: p.symbol,
      todayChangePercent: p.todayChangePercent,
      label: `${p.symbol} ${p.todayChangePercent}%`,
    }));
    ipcRenderer.send('msg', { type: 'tray', positions });
  }

  async componentDidMount() {
    observe(this.props.store.userStore, 'positions', change => {
      this.renderUpdate();
      this.checkAlerts();
    });

    observe(this.props.store.userStore, 'updateInterval', change => {
      this.state.intervals.forEach(clearInterval);
      this.setup();
    });

    this.setup();
  }

  checkAlerts() {
    const { enabledNotifications, watchlist, minNotificationChangePercent, notifyOnlyPositions, minNotificationTriggerMinute, stockAlerts, positions } = this.props.store.userStore;
    if (enabledNotifications) {
      let stocks = positions.peek();
      if (!notifyOnlyPositions) stocks.push(...watchlist.peek())
      stocks
        .filter(s => (Math.abs(parseFloat(s.todayChangePercent)) >= minNotificationChangePercent) && 
          (!stockAlerts.get(s.symbol) || Date.now() > stockAlerts.get(s.symbol)))
        .forEach(s => {
          stockAlerts.set(s.symbol, Date.now() + minNotificationTriggerMinute * 60 * 1000);
          const change = parseFloat(s.todayChangePercent);
          notify('Price Alert', `${s.symbol} is ${change > 0 ? 'up' : 'down'} ${change}%`, change > 0 ? upImg : downImg)
        });
    }
  }

  async setup() {
    const intervals = [];
    intervals.push(observe(this.props.store.userStore, 'portfolio', async change => {
      const { portfolio } = this.props.store.userStore;
      this.props.store.userStore.prevEquity = change.oldValue.equity;
      // set image
      const image = new Jimp(100, 20);
      const font = await Jimp.loadFont(Jimp.FONT_SANS_14_BLACK);
      const text = `${num(portfolio.todayChangePercent, { after: '%' })}`;
      image.print(font, 5, 0, text);
      image.color([ { apply: portfolio.todayChange >= 0 ? 'green' : 'red', params: [ 180 ] } ]);
      image.crop(0, 0, text.length * 10, 20);
      image.write(trayImagePath);
    }));

    await this.updatePositions();
    await this.updateStocks();

    intervals.push(setInterval(this.updateStocks, this.props.store.userStore.updateInterval * 1000));
    intervals.push(setInterval(this.updatePositions, 60 * 1000));

    this.setState({ ...this.state, intervals });
  }

  componentWillUnmount() {
    this.state.intervals.forEach(clearInterval);
  }

  render() {
    return null
  }
}

