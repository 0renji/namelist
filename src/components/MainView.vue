<template>
    <div>
        <valuepicker></valuepicker>
        <valuepicker></valuepicker>
        <barchart></barchart>

        <div v-if="errMsg"> {{errMsg}} </div>
    </div>
</template>

<script>
    import api from '../api/'

    export default {
        name: "MainView",

        // 0 -> surname
        // 1 -> count
        // 2 -> sex
        // 3 -> position

        data: () => {
            return {
                names: [],
                errMsg: undefined,
                selectedYear: 2019,
                selectedDistrict: 'friedrichshain-kreuzberg',
            }
        },

        created() {
            const cvs = api.getNamesFor(this.selectedYear, this.selectedDistrict)
            if (cvs) {
                this.names = cvs
            }
            else {
                this.errMsg = 'Sadly no data for the year ' + this.selectedYear + ' and district ' + this.selectedYear
            }
        },

        computed: {
        }
    }
</script>

<style scoped>

</style>
