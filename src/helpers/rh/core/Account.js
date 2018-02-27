import Request from './Request';

export default class Account {

  static async url() {
    if (!this._url) {
      const accounts = await Request.getPersonal('accounts');
      this._url = accounts.results[0].url;
    }
    return this._url;
  }

  get positions() {
    return Request.getPersonal('positions');
  }

  get accounts() {
    return Request.getPersonal('accounts');
  }

  get user() {
    return Request.getPersonal('user');
  }

  get investment() {
    return Request.getPersonal('user/investment_profile');
  }

  get basicInfo() {
    return Request.getPersonal('user/basic_info');
  }

  get watchlists() {
    return Request.getPersonal('watchlists');
  }

  get defaultWatchlist() {
    return Request.getPersonal('watchlists/Default');
  }

  get portfolios() {
    return Request.getPersonal('portfolios');
  }

  async defaultPortfolio() {
    if (!this.defaultPortfolioId) {
      const portfolios = await this.portfolios;
      this.defaultPortfolioId = portfolios.results[0].url.split('/').slice(-2)[0];
    }
    return Request.getPersonal(`portfolios/${this.defaultPortfolioId}`);
  }
}
