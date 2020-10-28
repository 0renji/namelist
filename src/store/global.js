export default {
    name: 'globals',
    namespaced: true,

    state: {
        selectedYear: undefined,
        selectedDistrict: undefined,
        nameFilter: undefined,
        data: undefined
    },

    getters: {
        selectedYear: state => state.selectedYear,
        selectedDistrict: state => state.selectedDistrict,
        nameFilter: state => state.nameFilter,
        data: state => state.data,
    },
    mutations: {
        setSelectedYear (state, selectedYear) {
            state.selectedYear = selectedYear
        },
        setDistrict (state, selectedDistrict) {
            state.selectedDistrict = selectedDistrict
        },
        setNameFilter (state, nameFilter) {
            state.nameFilter = nameFilter
        },
        setData(state, data) {
            state.data = data
        }
    },
}
