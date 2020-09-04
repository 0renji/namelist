import Vuex from 'vuex'
import Vue from 'vue'
import global from './global'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        global,
    },
})

window['store'] = store
export default store
