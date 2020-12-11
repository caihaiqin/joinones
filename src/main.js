import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/icon/iconfont.css'
import '@/common/element.js'
import {
  MessageBox
} from 'element-ui'

import {
  setPipelineNums,
  getPipelineNums
} from 'network/pipeline/pipelineNums.js'
Vue.prototype.$apiUrl = "http://127.0.0.1:3000"
Vue.prototype.$confirm = MessageBox.confirm
//添加事件总线
Vue.prototype.$EventBus = new Vue()
Vue.config.productionTip = false
// Vue.prototype.$http = axios
// axios.defaults.baseURL = 'http://127.0.0.1:3000'
// axios.defaults.headers.post['Content-Type'] = 'application/json';


new Vue({
  render: h => h(App),
  router,
  store,
  created() {
    //在页面加载时读取数据库里的状态信息
    let pipelineNums = {};
    getPipelineNums().then(res => {
      if (res.err == 0) {
        pipelineNums = res.data[0]
        //在页面加载时将数据库获取到的状态人数信息存储到sessionStorage里
        sessionStorage.setItem("store", JSON.stringify(pipelineNums))
        //读取sessionStorage里的状态信息赋值到vuex状态中
        if (sessionStorage.getItem("store")) {
          this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
        }
      }
      console.log(pipelineNums);
    })


    //在页面刷新/关闭时将vuex里的信息保存到sessionStorage里，同时保存到数据库
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
      setPipelineNums(this.$store.state).then(res => {
        console.log(res);
      })

      console.log("浏览器刷新")
    })
  }
}).$mount('#app')
