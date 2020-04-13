// 声明模块路由源
const Index = () => import('@/views/shops')
const Branch = () => import('@/views/shops/children/Branch')
const Terminal = () => import('@/views/shops/children/Terminal')
const Department = () => import('@/views/shops/children/Department')
const Staff = () => import('@/views/shops/children/Staff')
const Permissions = () => import('@/views/shops/children/Permissions')

export default [
  {
    path: '/oms/shops',
    name: 'shops_index',
    component: Index,
    redirect: '/oms/shops/branch',
    children: [
      {
        path: 'branch',
        name: 'branch',
        component: Branch
      },
      {
        path: 'terminal',
        name: 'terminal',
        component: Terminal
      },
      {
        path: 'department',
        name: 'department',
        component: Department
      },
      {
        path: 'staff',
        name: 'staff',
        component: Staff
      },
      {
        path: 'permissions',
        name: 'permissions',
        component: Permissions
      }
    ]
  }

]
