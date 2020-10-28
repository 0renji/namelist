<template>
    <div>
        <value-picker/>
        <v-btn :disabled="!areSelectionsMade" depressed text @click="requestData">Namen holen</v-btn>
        <div v-if="errMsg"> {{errMsg}} </div>
        <v-container v-else class="chart-container">
                <Barchart  :chart-data="chartData" :options="options" ></Barchart>
                <div class="btn-container">
                        <v-btn @click="switchData('fast-backward')" depressed text :disabled="this.startIndex === 0">
                          <v-icon>mdi-skip-backward</v-icon>
                        </v-btn>
                        <v-btn depressed text :disabled="this.startIndex === 0" @click="switchData('back')">
                          <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                        <v-spacer/>
                        <div>{{ partitionString }}</div>
                        <v-spacer/>
                        <v-btn depressed text :disabled="this.endIndex === this.displayedNames.length" @click="switchData('forward')">
                          <v-icon>mdi-arrow-right</v-icon>
                        </v-btn>
                        <v-btn @click="switchData('fast-forward')" depressed text :disabled="this.endIndex === this.displayedNames.length">
                          <v-icon>mdi-skip-forward</v-icon>
                        </v-btn>
                </div>
        </v-container>
        <v-select
            class="selector-pagination"
            :disabled="this.displayedNames.length === 0"
            v-on:change="changeShownPerPage"
            v-model="shownPerPage"
            :items="paginations"
            label="Anzahl pro Seite"/>
    </div>
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

                partitionString: '',
                shownPerPage: 0,

                chartData: {},
                errMsg: undefined,
            }
        },

        computed: {
          paginations() {
            let paginations = []
            if (this.displayedNames.length > 5) {
              paginations.push(5)
            }
            if (this.displayedNames.length > 10) {
              paginations.push(10)
            }
            if (this.displayedNames.length > 50) {
              paginations.push(50)
            }
            if (this.displayedNames.length > 100) {
              paginations.push(100)
            }
            if (this.displayedNames.length > 1000) {
              paginations.push(1000)
            }

            paginations.push('alle')

            return paginations
          },
          areSelectionsMade() {
            return !!(this.$store.getters['global/selectedYear'] && this.$store.getters['global/selectedDistrict'])
          }
        },

        methods: {
              // 0 -> surname
              // 1 -> count
              // 2 -> sex
              // 3 -> position

            requestData() {
                let year = this.$store.getters["global/selectedYear"]
                let district = this.$store.getters["global/selectedDistrict"]

                console.log(year, district.toLowerCase());

                api.getNamesFor(year, district.toLowerCase())
                    .then(data => {
                        if (data) {
                            this.fillData(data.data)
                        }
                        else {
                            this.errMsg = 'Sadly no data for the year ' + this.selectedYear + ' and district ' + this.selectedYear
                        }
                    })
            },

          /**
           * fills the data array, splitting the data into the displayedNames array (x axis)
           * and the nameCounts object
           */
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

                if (this.displayedNames.length > 10) {
                  this.shownPerPage = 10
                }
                else {
                  this.shownPerPage = this.displayedNames.length
                }

                this.displayedCounts = Object.values(chartNames)
                this.startIndex = 0
                this.endIndex = this.displayedNames.length / (this.displayedNames.length / this.shownPerPage)
                this.setPartitionString()
                this.fillChart()
            },

            /**
             * fills the chart with data using the current start and end index
             */
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

            /**
             * changes the data on button press keeping the current pagination in mind
             */
            switchData(direction) {
                switch (direction){
                case 'forward':
                  if (this.startIndex >= 0
                      && this.endIndex <= this.displayedNames.length - this.shownPerPage) {
                    this.startIndex = this.startIndex + this.shownPerPage
                    this.endIndex = this.endIndex + this.shownPerPage
                  } else if(this.endIndex + this.shownPerPage > this.displayedNames.length){
                    this.startIndex = this.endIndex - ((this.endIndex + this.shownPerPage) - this.displayedNames.length)
                    this.endIndex = this.displayedNames.length
                  }
                  break;
                case 'back':
                  if(this.startIndex !== 0 && this.startIndex - this.shownPerPage >= 0){
                    this.startIndex = this.startIndex - this.shownPerPage
                    this.endIndex = this.endIndex - this.shownPerPage
                  }
                  break;
                 case 'fast-forward':
                   this.startIndex = this.displayedNames.length - this.shownPerPage
                   this.endIndex = this.displayedNames.length
                   break;
                 case 'fast-backward':
                   this.startIndex = 0
                   this.endIndex = this.shownPerPage
                   break;
                }

              this.setPartitionString()
              this.fillChart()
            },

            /**
             * sets the shown string with the displayed data and current pagination
             */
            setPartitionString() {
              if (this.shownPerPage === this.displayedNames.length) {
                this.partitionString = 'alle ' + this.displayedNames.length
              }
              else {
                this.partitionString = this.startIndex + ' - ' + this.endIndex + ' von ' + this.displayedNames.length
              }
           },

            changeShownPerPage(selection) {
                // replace the "alle" string to the data length
                if(selection === 'alle') {
                  this.shownPerPage = this.displayedNames.length
                }

                this.startIndex = 0
                this.endIndex = this.shownPerPage

                this.setPartitionString()
                this.fillChart()
             }
        }
    }
</script>

<style lang="scss">
.selector-pagination{
  max-width: 7vw;
  margin-left: 1em;
}
.chart-container {
        margin-top: 2%;
        margin-bottom: 2%;


  .btn-container {
             display: flex;
             flex-direction: row;
             margin-top: 1em;
        }
}

</style>
