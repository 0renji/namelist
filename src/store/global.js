export default {
    name: 'globals',
    namespaced: true,

    state: {
        selectedYear: undefined,
        selectedDistrict: undefined,
    },

    getters: {
        selectedYear: state => state.selectedYear,
        selectedDistrict: state => state.selectedDistrict
    },
    mutations: {
        setSelectedYear (state, selectedYear) {
            state.selectedYear = selectedYear
        },
        setDistrict (state, selectedDistrict) {
            state.selectedDistrict = selectedDistrict
        }
    },
}
