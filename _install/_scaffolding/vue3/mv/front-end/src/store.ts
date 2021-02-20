import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

export interface State {
  colorScheme: string;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    colorScheme: 'browser',
  },
});

export function useStore() {
  return baseUseStore(key);
}
