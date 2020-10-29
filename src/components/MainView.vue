<template>
    <div class="view-wrapper">
        <value-picker/>
        <v-btn :disabled="!areSelectionsMade"
               depressed
               text
               @click="requestData">
          Namen holen
        </v-btn>
        <v-btn depressed
               text
               @click="fillData(storedData)">
          Filtern
        </v-btn>
        <div v-if="errMsg">
          {{errMsg}}
        </div>
        <v-container v-else
                     class="chart-container">
                <Barchart
                    :chart-data="chartData"
                    :options="options" />
                <div class="btn-container">
                        <v-btn @click="switchData('fast-backward')"
                               depressed
                               text
                               :disabled="this.startIndex === 0">
                          <v-icon>mdi-skip-backward</v-icon>
                        </v-btn>
                        <v-btn depressed
                               text
                               :disabled="this.startIndex === 0"
                               @click="switchData('back')">
                          <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                        <v-spacer/>
                        <div>{{ partitionString }}</div>
                        <v-spacer/>
                        <v-btn depressed
                               text
                               :disabled="this.endIndex === this.displayedNames.length"
                               @click="switchData('forward')">
                          <v-icon>mdi-arrow-right</v-icon>
                        </v-btn>
                        <v-btn @click="switchData('fast-forward')"
                               depressed
                               text
                               :disabled="this.endIndex === this.displayedNames.length">
                          <v-icon>mdi-skip-forward</v-icon>
                        </v-btn>
                </div>
        </v-container>
      <div class="selector-wrapper">
        <v-spacer/>
        <v-select
                  class="selector-pagination"
                  :disabled="this.displayedNames.length === 0"
                  v-on:change="changeShownPerPage"
                  v-model="shownPerPage"
                  :items="paginations"
                  label="Anzahl pro Seite"/>
         <v-text-field
                        class="selector-jumpto"
                        :disabled="this.displayedNames.length === 0"
                        v-on:change="jumpToPage"
                        label=""
                        placeholder="Springe zu"
                        clearable/>
        <v-spacer/>
      </div>
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
          },
          nameFilter() {
            let filter = this.$store.getters['global/nameFilter']

            if (!filter) {
              return ''
            }

            return filter.trim()
          },
          storedData() {
            return this.$store.getters['global/data']
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

                if (district === 'Neukölln') {
                    district = 'Neukoelln';
                }

                api.getNamesFor(year, district.toLowerCase())
                    .then(data => {
                        if (data) {
                          this.$store.commit('global/setData', data.data)
                          this.fillData(data.data)
                        }
                        else {
                            this.errMsg = 'Sadly no data for the year ' + this.selectedYear + ' and district ' + this.selectedYear
                        }
                    })
            },

            mapNameCounts(data) {
            let nameCounts = {}

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

            return nameCounts
          },

            /**
             * fills the data array, splitting the data into the displayedNames array (x axis)
             * and the nameCounts object
             */
            fillData(data) {
                //expects an array with several arrays
                let nameCounts = this.mapNameCounts(data)

                nameCounts = this.filterByName(nameCounts)

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
             },

            filterByName(nameCounts) {
                // return nameCounts from original data
                if (this.nameFilter.length === 0) {
                  return this.mapNameCounts(this.storedData)
                }
                let names = Object.keys(nameCounts)

                let filteredNameCounts = {}

                // filter the given nameCounts / data
                let filteredNames = names.filter(name  => name.toLowerCase().indexOf(this.nameFilter.toLowerCase()) > -1)

                filteredNames.forEach(name => filteredNameCounts[name] = nameCounts[name])
                return filteredNameCounts
            },

            jumpToPage(page) {
              const jumpPage = parseInt(page)

              if (!page) {
                this.setPartitionString()
                this.fillChart()
                return null
              }
              else if (jumpPage < 0 || jumpPage > this.displayedNames.length) {
                return null
              }

              if(this.startIndex + this.shownPerPage > this.displayedNames.length) {
                this.endIndex = this.displayedNames.length
              } else {
                this.endIndex = jumpPage + this.shownPerPage
              }

              this.startIndex = jumpPage

              this.setPartitionString()
              this.fillChart()
            }
        }
    }
</script>

<style lang="scss">
.view-wrapper{
  padding: 1em;
}

.selector-wrapper{
  display: flex;
  flex-direction: row;
}
.selector-pagination{
  max-width: 10%;
  margin-left: 1em;
}
.selector-jumpto{
  max-width: 10%;
  margin-left: 1em;
}
.chart-container {
        margin-top: 2%;


  .btn-container {
             display: flex;
             flex-direction: row;
             margin-top: 1em;
        }
}

</style>
