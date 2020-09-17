import Vue from 'vue'
import {

  Button,
  ButtonGroup,
  Form,
  FormItem,
  Input,
  Message
} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//Message需进行全局挂载
Vue.prototype.$message = Message
