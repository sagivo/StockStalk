import request from 'request-promise-native';
const baseUrl = 'https://api.robinhood.com';
let token;

export default class Request {
  static setToken(val) {  token = val };

  static async get(url, qs, extraParams = {}) {
    return request(Object.assign({
      url: `${baseUrl}/${url}/?`,
      json: true,
      qs,
    }, extraParams));
  }

  static async post(url, form, extraParams = {}) {
    return request.post(Object.assign({
      url: `${baseUrl}/${url}/`,
      json: true,
      form,
    }, extraParams));
  }

  static async getPersonal(url, qs, extraParams = {}) {
    extraParams.headers = extraParams.headers || {};
    extraParams.headers['Authorization'] = `Token ${token}`;
    return this.get(url, qs, extraParams);
  }

  static async postPersonal(url, form, extraParams = {}) {
    extraParams.headers = extraParams.headers || {};
    extraParams.headers['Authorization'] = `Token ${token}`;
    return this.post(url, form, extraParams);
  }
}
