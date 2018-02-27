import 'babel-polyfill';
import Request from './core/Request';
import Auth from './core/Auth';
import Account from './core/Account';
import Order from './core/Order';
import Instrument from './core/Instrument';
import Stock from './core/Stock';

export default class RobinhoodNode {
  get Stock() { return Stock };
  get Auth() { return Auth };
  get Account() { return Account };
  get Order() { return Order };
  get Instrument() { return Instrument };

  constructor(params = {}) {
    if (params.user && params.password) {
      this.getToken(params.user, params.password, params.mfa);
    }
    if (params.token) {
      Request.setToken(params.token);
    }
  }

  async getToken(user, password, mfa) {
    const token = await Auth.getToken(user, password, mfa);
    Request.setToken(token);
    return token;
  }
}
