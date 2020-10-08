import Vue from 'vue'
import {

  Button,
  ButtonGroup,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  Submenu,
  Card,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col,
  Table,
  TableColumn,
  Tooltip,
  Pagination,
  Tabs,
  TabPane,
  Select,
  Option,
  DatePicker,
  Dialog,
  Upload,
  Tag,
  Steps,
  Step,
  Cascader,
  Timeline,
  TimelineItem,
} from 'element-ui'

Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Cascader)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tag)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Pagination)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Card)

Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
//Message需进行全局挂载
Vue.prototype.$message = Message
