import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
