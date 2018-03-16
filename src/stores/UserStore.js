import { observable, computed, action } from 'mobx';
import { persist } from 'mobx-persist';
import RH from '../helpers/rh/index';
import { auth, db } from '../helpers/firebase';
let cachedPositions = {};
const electron = window.require('electron');

export default class UserStore {
  constructor() {
    auth.onAuthStateChanged(this.setUser.bind(this));
  }

  @observable user;
  @observable prevEquity;
  @observable stockAlerts = new Map();
  @observable stocks = new Map();
  @observable appVersion;
  @observable selectedStock;
  @persist @observable notifyOnlyPositions = true;
  @persist @observable updateInterval = 5;
  @persist @observable token = null;
  @persist @observable enableOnStartup = true;
  @persist @observable newVersion = false;
  @persist @observable enabledNotifications = true;
  @persist @observable minNotificationChangePercent = 5;
  @persist @observable minNotificationTriggerMinute = 60;

  @observable portfolio = new Map();
  @observable positions = [];
  @observable watchlist = [];
  @observable routeParams = new Map();
  @observable page = 'LOGIN';

  @action link = (page, routeParams = {}) => {
    this.page = page;
    this.routeParams = new Map(Object.entries(routeParams));
  }

  @computed get showBadReviews() {
    return this.canUse('SHOW_BAD_REVIEWS');
  }

  @action async setUser(user) {
    this.user = user;
    if (this.user) {
      if (this.token) this.link('MAIN');
      else this.link('RHLOGIN');

      const { uid, email } = user;
      this.appVersion = electron.remote.app.getVersion() || 'dev';
      await db.collection('users').doc(uid).set({ uid, email, appVersion: this.appVersion || 'dev', os: window.process.platform }, { merge: true });
      db.collection('users').doc(uid).onSnapshot(snapshot => this.user = snapshot.data());
    }
    else {
      this.token = null;
      this.link('REGISTER');
    }
  }

  @action signForRobo() {
    const { uid } = this.user;
    db.collection('users').doc(uid).update({ isSignForRobo: true });
  }

  @action async updatePositions() {
    const rh = new RH({ token: this.token });
    const Instrument = rh.Instrument;
    const account = new rh.Account();

    const allPositions = (await account.positions).results
      .map(p => ({
        ...p,
        instrumentId: p.instrument.split('/').slice(-2)[0],
      }));
    cachedPositions = {};

    const calls = allPositions.map(p => async () => {
        const instrument = await Instrument.valueById(p.instrumentId);
        p.symbol = instrument.symbol;
        p.name = instrument.name;
        cachedPositions[p.symbol] = p;
      }
    );

    await Promise.all(calls.map(c=> c()))
  }

  @action async setToken(username, password, mfa) {
    const rh = new RH();
    let res;
    try {
      res = await rh.Auth.getToken(username, password, mfa);
      if (res.token) {
        this.token = res.token;
        this.link('MAIN');
        db.collection('users').doc(this.user.uid).set({ rhUser: username }, { merge: true })
      }
    } catch (err) {
      console.error(err);
      return null;
    }
    return res;
  }

  @action async updateStocks() {
    const rh = new RH({ token: this.token });
    const account = new rh.Account();
    const portfolio = await account.defaultPortfolio();
    portfolio.todayChange = (portfolio.equity - portfolio.equity_previous_close).toFixed(2);
    portfolio.todayChangePercent =  ((portfolio.equity - portfolio.equity_previous_close)/portfolio.equity_previous_close * 100).toFixed(2);
    portfolio.buyingPower = parseFloat(portfolio.equity) - parseFloat(portfolio.market_value);
    this.portfolio = portfolio;

    const symbols = Object.keys(cachedPositions).slice(0, 1630).join(',');
    if (!symbols.length) return
    const stock = new rh.Stock(symbols);
    const quotes = (await stock.quote).results.filter(a => a);

    this.positions = quotes.filter(d => cachedPositions[d.symbol].quantity > 0).map((quote, i) => {
      const price = parseFloat(quote.last_trade_price).toFixed(2); //last_extended_hours_trade_price
      const quantity = cachedPositions[quote.symbol].quantity;
      const stock = {
        ...cachedPositions[quote.symbol],
        ...quote,
        equity: price * quantity,
        last: price,
        close: quote.previous_close,
        todayChange: ((price - quote.previous_close) * quantity).toFixed(2),
        todayChangePercent: ((price - quote.previous_close)/quote.previous_close * 100).toFixed(2),
        totalChange: ((price - cachedPositions[quote.symbol].average_buy_price) * quantity).toFixed(2),
        totalChangePercent: ((price - cachedPositions[quote.symbol].average_buy_price)/cachedPositions[quote.symbol].average_buy_price * 100).toFixed(2),
        i,
      }

      this.stocks.set(quote.symbol, stock);

      return stock;
    }).sort((a, b) => a.i - b.i);

    this.watchlist = quotes.filter(d => !cachedPositions[d.symbol] || parseFloat(cachedPositions[d.symbol].quantity) === 0).map((quote, i) => {
      const price = parseFloat(quote.last_trade_price).toFixed(2); //last_extended_hours_trade_price
      const stock = {
        ...cachedPositions[quote.symbol],
        ...quote,
        last: price,
        close: quote.previous_close,
        todayChangePercent: ((price - quote.previous_close)/quote.previous_close * 100).toFixed(2),
        i,
      }
      this.stocks.set(quote.symbol, stock);

      return stock;
    }).sort((a, b) => a.i - b.i);
  }
}
