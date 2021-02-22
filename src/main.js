import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入px转rem文件
import 'lib-flexible/flexible'


// 引入组件
import {
  Button,
  Tabbar,
  TabbarItem,
  Swipe, 
  SwipeItem,
  Popup,
  Circle,
  Tab, 
  Tabs, 
  NoticeBar,
  Slider,
  Icon,
  List,
  Search  

} from 'vant';

// 注册组件
Vue
  .use(Button)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Popup)
  .use(Circle)
  .use(Tab)
  .use(Tabs)
  .use(NoticeBar)
  .use(Slider)
  .use(Icon)
  .use(List)
  .use(Search)
  


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


// 主题色 #a4c9ff