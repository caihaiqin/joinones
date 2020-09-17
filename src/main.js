import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
import '@/common/element.js'
Vue.config.productionTip = false
// Vue.prototype.$http = axios
// axios.defaults.baseURL = 'http://127.0.0.1:3000'
// axios.defaults.headers.post['Content-Type'] = 'application/json';


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
