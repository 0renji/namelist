<template>
        <div v-if="errMsg"> {{errMsg}} </div>
        <Barchart v-else :chart-data="chartData" ></Barchart>
</template>

<script>
    import api from '../api/'
    import Barchart from "@/components/Barchart.js";

    export default {
        name: "MainView",
        components:{
            Barchart
        },

        data: () => {
            return {

                chartData: {},
                nameData: [],
                labels: [], //names

                errMsg: undefined,
                selectedYear: 2019,
                selectedDistrict: 'friedrichshain-kreuzberg',
            }
        },

        created() {
            api.getNamesFor(this.selectedYear, this.selectedDistrict)
            .then(data => {
                if (data) {
                    this.fillData(data.data)
                }
                else {
                    this.errMsg = 'Sadly no data for the year ' + this.selectedYear + ' and district ' + this.selectedYear
                }
            })

        },

        computed: {

        },

        methods: {

            // 0 -> surname
            // 1 -> count
            // 2 -> sex
            // 3 -> position

            fillData(data) {
                //expects an array with several arrays
                this.labels = []
                this.chartData = {}
                this.nameData = []

                data.forEach( (nameArr, index) => {
                    if (index !== 0) {
                        this.labels.push(nameArr[0])
                       this.nameData.push(nameArr[2])
                    }
                })

                this.chartData = {
                    label: this.labels,
                    datasets: this.nameData
                }

                console.log(this.labels)
                console.log(this.chartData)
            }
        }
    }
</script>

<style scoped>

</style>
