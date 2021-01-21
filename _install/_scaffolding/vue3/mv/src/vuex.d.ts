import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
    // declare your own store states
    interface State {
        state: {
            devMode: boolean|undefined,
        }
    }

    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}