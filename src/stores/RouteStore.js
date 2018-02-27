import { observable, action } from 'mobx';

export default class RouteStore {

  @observable page = 'MAIN'; // property

  @observable params = new Map();

  @action link = (page, params = {}) => {
    this.page = page;
    this.params = new Map(Object.entries(params));
  }

}
