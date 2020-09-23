<template>
        <div v-if="errMsg"> {{errMsg}} </div>
        <Barchart v-else :chart-data="chartData" :options="options" ></Barchart>
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
                options: {
                   scales: {
                       yAxes: [
                           {
                             ticks: { beginAtZero: true }
                           }]
                        },
                        responsive: true,
                        maintainAspectRatio: false
                },
                chartData: {},
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
                const nameCounts = {}

                data.forEach((nameArr, index) => {
                    // 0 is header
                    if (index !== 0) {
                        if (nameArr[0] in nameCounts) {
                                nameCounts[nameArr[0]] += parseInt(nameArr[1])
                        } else {
                             nameCounts[nameArr[0]]  = parseInt(nameArr[1])
                        }
                    }
                })

                let keysSorted = Object.keys(nameCounts).sort(function(a,b){return nameCounts[b]-nameCounts[a]})

                const chartNames = {}

                keysSorted.forEach(name => {
                     chartNames[name] = nameCounts[name]
                })

                this.chartData = {
                labels: Object.keys(chartNames),
                datasets: [
                            {
                               label: 'Vornamen',
                               backgroundColor: '#f30000',
                               data: Object.values(chartNames)
                            },
                          ]
                }
            }
        }
    }
</script>

<style lang="scss">
        .chart-container {
                flex-grow: 1;
                min-height: 0;

                > div {
                        position: relative;
                        height: 100%;
                }
        }

</style>
