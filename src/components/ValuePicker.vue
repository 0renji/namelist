<template>
  <div class="text-center">
    <v-select
    v-on:change="saveYear"
    :items="years"
    label="Jahre">
    </v-select>
    <v-select
    v-on:change="saveDistrict"
    :items="districts"
    label="Bezirke">
    </v-select>
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
                    'Friedrichshain-Kreuzberg' ,
                    'MerdanLand'
                ],
            }
        },

        methods: {
          saveYear (selection) {
            this.$store.commit('global/setSelectedYear', selection);
          },
          saveDistrict (selection) {
            this.$store.commit('global/setDistrict', selection);
          },
        }
    }
</script>

<style scoped>

</style>
