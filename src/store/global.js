export default {
    name: 'globals',
    namespaced: true,

    state: {
        names: [],
    },

    getters: {
        test: state => state.test,
        names: state => state.names,
    },
    mutations: {
        setNames (state, names) {
            state.names = names
        }
    },
}
