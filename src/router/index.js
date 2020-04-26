// 导入路径视图
import Settings from './settings'
import Shops from './shops'
import Sells from './sells'

// 登录视图
const Login = () => import('@/views/login')
// 页面内容主视图装载
const Oms = () => import('@/views')
// 页面主视图-首页图表
const OmsHome = () => import('@/views/home')

export default [
  {
    path: '/',
    redirect: '/oms'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/oms',
    name: 'oms',
    component: Oms,
    redirect: '/oms/home',
    children: [
      {
        path: 'home',
        name: 'homepage',
        component: OmsHome
      }, ...Settings, ...Shops, ...Sells]
  }
]
