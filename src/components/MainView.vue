<template>
    <div>
        <value-picker :year="true" :district="false"> </value-picker>
        <value-picker :year="false" :district="true"> </value-picker>
        <barchart></barchart>

        <div v-if="errMsg"> {{errMsg}} </div>
    </div>
</template>

<script>
    //import api from '../api/'
    import ValuePicker from './ValuePicker.vue'

    export default {
        name: "MainView",
        
        components: {ValuePicker},

        // 0 -> surname
        // 1 -> count
        // 2 -> sex
        // 3 -> position

        data: () => {
            return {
                names: [],
                errMsg: undefined,
                selectedYear: undefined,
                selectedDistrict: undefined,
            }
        },

        /*created() {
            const cvs = api.getNamesFor(this.selectedYear, this.selectedDistrict)
            if (cvs) {
                this.names = cvs
            }
            else {
                this.errMsg = 'Sadly no data for the year ' + this.selectedYear + ' and district ' + this.selectedYear
            }
        },*/

        computed: {
        },

        methods: {

        }
    }
</script>

<style scoped>

</style>
