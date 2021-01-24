import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

export interface State {
  count: number;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    devMode: import.meta.env.VITE_DEV_MODE === 'true',
  },
});

export function useStore() {
  return baseUseStore(key);
}
