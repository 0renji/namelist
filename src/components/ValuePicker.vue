<template>
  <div class="text-center">
    <v-menu 
      offset-y
      transition="scale-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Dropdown
        </v-btn>
      </template>
      <v-list v-if="year">
        <v-list-item @click="saveYear(item.title)"
          v-for="(item, index) in years"
          :key="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list v-if="district">
        <v-list-item @click="saveDistrict(item.title)"
          v-for="(item, index) in districts"
          :key="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
    //import store from '../store';

    export default {
        name: "ValuePicker",
        namespaced: true,

        props: {
            year: Boolean,
            district: Boolean,
        },
        
        data () {
            return {
                 years: [
                    { title: '2012' },
                    { title: '2013' },
                    { title: '2014' },
                    { title: '2015' },
                    { title: '2016' },
                    { title: '2017' },
                    { title: '2018' },
                    { title: '2019' }
                ],

                districts: [
                    { title: 'Friedrichshain-Kreuzberg' },
                    { title: 'MerdanLand'  }
                ],
            }
        },

        methods: {
          saveYear (selection) {
            console.log(selection)
            this.$store.commit['setSelectedYear', selection];
          },
          saveDistrict (selection) {
            this.selectedDistrict = selection
            console.log(this.selectedDistrict)
          },
        }
    }
</script>

<style scoped>

</style>
