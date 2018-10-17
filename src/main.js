// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import firebase from 'firebase'
import 'firebase/firestore'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { config } from './config/firebaseConfig'
import { store } from './store/store'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(require('vue-moment'))
Vue.use(VueFire)
firebase.initializeApp(config)
export const storage = firebase.storage()
export const db = firebase.firestore()
firebase.auth().onAuthStateChanged(function (user) {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    components: { App },
    store: store,
    template: '<App/>'
  })
})
