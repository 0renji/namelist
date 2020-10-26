export default {
    name: 'globals',
    namespaced: true,

    state: {
        names: [],
        selectedYear: undefined,
        selectedDistrict: undefined,
    },

    getters: {
        test: state => state.test,
        names: state => state.names,
        selectedYear: state => state.selectedYear,
        selectedDistrict: state => state.selectedDistrict
    },
    mutations: {
        setNames (state, names) {
            state.names = names
        },
        setSelectedYear (state, selectedYear) {
            state.selectedYear = selectedYear
        },
        setDistrict (state, selectedDistrict) {
            state.selectedDistrict = selectedDistrict
        }
    },
}
