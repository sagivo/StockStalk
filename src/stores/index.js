import UserStore from './UserStore';
import { create } from 'mobx-persist';

const hydrate = create()

const userStore = new UserStore();

hydrate('_us_', userStore);

const stores = {
  userStore,
};

export default stores;
