export default {
    name: 'globals',
    namespaced: true,

    state: {
        test: 'hi',
    },
    getters: {
        test: state => state.test,
    },
    mutations: {},
}
