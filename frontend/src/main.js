import Vue from 'vue'
import App from './App.vue'
//import Modal from './Modal.vue'

import VModal from 'vue-js-modal'

Vue.use(VModal)

new Vue({
  el: '#app',
  render: h => h(App)
})

// new Vue({
//   el: '#app',
//   components: { Modal },
//   render: h => h(App)
// })
