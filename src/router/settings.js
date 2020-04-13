// 声明模块路由源
const Index = () => import('@/views/setting')
const SYSMenu = () => import('@/views/setting/children/SYSMenu')
const SYSButton = () => import('@/views/setting/children/SYSButton')
const License = () => import('@/views/setting/children/License')
const History = () => import('@/views/setting/children/History')
const Printing = () => import('@/views/setting/children/Printing')

export default [
  {
    path: '/oms/setting',
    name: 'setting_index',
    component: Index,
    redirect: '/oms/setting/sysmenu',
    children: [
      {
        path: 'sysmenu',
        name: 'sysmenu',
        component: SYSMenu
      },
      {
        path: 'sysbutton',
        name: 'sysbutton',
        component: SYSButton
      },
      {
        path: 'license',
        name: 'license',
        component: License
      },
      {
        path: 'history',
        name: 'history',
        component: History
      },
      {
        path: 'printing',
        name: 'printing',
        component: Printing
      }
    ]
  }

]
