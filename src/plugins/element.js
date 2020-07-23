/* eslint-disable import/no-duplicates */
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // 1、导入弹框组件
// // 2、Message挂载为 vue原型上的一个 属性
// // 3、具体vue组件直接通过 $his.$message. 就可以提示信息了
// import { Message } from 'element-ui'

import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader
} from 'element-ui'

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
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
// Message需要进行全局挂载，挂载到vue身上
// 把Message挂载到vue的原型对象上，这样每一个vue组件都可以通过，this来访问到message，只要访问到message,就可以来进行 弹框提示了
Vue.prototype.$message = Message
// 这个MessageBox比较特殊，不需要use,只需要进行全局挂载$confirm
Vue.prototype.$confirm = MessageBox.confirm
