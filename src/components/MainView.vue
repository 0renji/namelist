<template>
    <div>
        <value-picker :year="true" :district="false"> </value-picker>
        <value-picker :year="false" :district="true"> </value-picker>
        <barchart></barchart>

        <div v-if="errMsg"> {{errMsg}} </div>
        <v-container v-else class="chart-container">
                <Barchart  :chart-data="chartData" :options="options" ></Barchart>
                <div class="btn-container">
                        <v-btn depressed :disabled="this.startIndex === 0" @click="switchData"> <v-icon>mdi-arrow-left</v-icon></v-btn>
                        <v-spacer/>
                        <div>{{partition}}</div>
                        <v-spacer/>
                        <v-btn depressed :disabled="this.startIndex !== 0" @click="switchData"> <v-icon>mdi-arrow-right</v-icon></v-btn>
                </div>
        </v-container>

</template>

<script>
    import api from '../api/'
    import Barchart from "@/components/Barchart.js";
    import ValuePicker from './ValuePicker.vue'

    export default {
        name: "MainView",
        components:{
            Barchart,
            ValuePicker
        },

        // 0 -> surname
        // 1 -> count
        // 2 -> sex
        // 3 -> position

        data: () => {
            return {
                options: {
                   responsive: true,
                   maintainAspectRatio: false,
                },

                sortedChartNamesAndCounts: {},
                displayedNames: [],
                displayedCounts:[],

                startIndex: 0,
                endIndex: 0,
                partition: 0,

                chartData: {},
                errMsg: undefined,
                selectedYear: undefined,
                selectedDistrict: undefined,
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

                this.displayedNames = Object.keys(chartNames)
                this.displayedCounts = Object.values(chartNames)
                this.endIndex = this.displayedNames.length / (this.displayedNames.length / 10)
                this.partition = this.startIndex + ' - ' + this.endIndex


                this.fillChart()
            },

            fillChart() {
                    this.chartData = {
                            labels: this.displayedNames.slice(this.startIndex, this.endIndex),
                            datasets: [
                                    {
                                            label: 'Vornamen',
                                            backgroundColor: '#f30000',
                                            data: this.displayedCounts.slice(this.startIndex, this.endIndex)
                                    },
                            ]
                    }
            },

            switchData() {
                    if (this.startIndex  !== this.displayedNames.length) {
                            // the lower half is shown, show the first half
                            this.startIndex = 0
                            this.endIndex = this.displayedNames.length / 2

                    } else {
                            this.startIndex = this.displayedNames.length / 2
                            this.endIndex = this.displayedNames.length
                    }

                    this.fillChart()
            }
        }
    }
</script>

<style lang="scss">
        .chart-container {
                margin-top: 10%;

                .btn-container {
                     display: flex;
                     flex-direction: row;
                     margin-top: 1em;
                }
        }

</style>
