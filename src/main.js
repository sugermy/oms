import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import store from './store'
import './plugins/element.js'
import './style/reset.less'
import './style/element.less'
import './style/public.less'

// 百度图表
import echarts from 'echarts'

// router
import ALLROUTERS from './router'

// http
import Ajax from './plugins/axios'

// 过滤器
import './plugins/filter'
// 全局组件注册
import SearchBar from './components/layout/SearchBar'
Vue.component('search-bar', SearchBar)// 顶部查询框

// 设置Vue在启动时是否生成生产提示
Vue.config.productionTip = process.env.NODE_ENV === 'development'
// 原型扩展
Vue.prototype.$ajax = new Ajax()
Vue.prototype.$echarts = echarts

/* 根据业务需求过滤需要的路由 */
const AllowRouter = new Router({
  routes: ALLROUTERS
})

// 解决两次访问相同路由地址报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 设置动态title
AllowRouter.beforeEach((to, from, next) => {
  if (to.meta.title) {
    // 跳转前动态设置当前title
    document.title = to.meta.title
  }
  next()
})
// Vue实例注册
Vue.use(Router)
new Vue({
  router: AllowRouter,
  store,
  render: h => h(App)
}).$mount('#app')
