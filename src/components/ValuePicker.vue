<template>
  <div class="selector-wrapper">
    <v-select
    class="selector"
    v-on:change="saveYear"
    :items="years"
    label="Jahr">
    </v-select>
    <v-select
    class="selector"
    v-on:change="saveDistrict"
    :items="districts"
    label="Bezirk">
    </v-select>
    <v-text-field class="selector"
                  label=""
                  placeholder="Filter"
                  clearable
                  v-on:change="saveNameFilter"
                  :disabled="!hasData"
    >
    </v-text-field>
    <v-spacer></v-spacer>
  </div>
</template>

<script>
    //import store from '../store';

    export default {
        name: "ValuePicker",
        namespaced: true,

        data () {
            return {
                 years: [
                    '2012',
                    '2013' ,
                    '2014' ,
                    '2015' ,
                    '2016' ,
                    '2017' ,
                    '2018' ,
                    '2019'
                ],

                districts: [
                        'Charlottenburg-Wilmersdorf',
                        'Friedrichshain-Kreuzberg',
                        'Lichtenberg',
                        'Marzahn-Hellersdorf',
                        'Mitte',
                        'Neukölln',
                        'Pankow',
                        'Reinickendorf',
                        'Spandau',
                        'Steglitz-Zehlendorf',
                        'Tempelhof-Schoeneberg',
                        'Treptow-Koepenick',
                ],
            }
        },
      computed: {
        hasData () {
          return !!this.$store.getters['global/data']
        }
      },

      methods: {
          saveYear (selection) {
            this.$store.commit('global/setSelectedYear', selection);
          },
          saveDistrict (selection) {
            this.$store.commit('global/setDistrict', selection);
          },
          saveNameFilter (selection) {
            this.$store.commit('global/setNameFilter', selection);
          },
        }
    }
</script>

<style lang="scss">
.selector-wrapper{
  display: flex;
  flex-direction: row;

  .selector{
    margin-left: 1em;
    max-width: 10vw;
  }
}
</style>
