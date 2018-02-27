import Request from './Request';;

export default class Auth {
  constructor(args) {
    return Request.post('api-token-auth', { symbols: this.symbols.map(s => s.toUpperCase()).join(',') } );
  }

  static getToken(username, password, mfa_code) {
    return Request.post('api-token-auth', { username, password, mfa_code });
  }
}