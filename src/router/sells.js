// 声明模块路由源
const Index = () => import('@/views/sells')
const Member = () => import('@/views/sells/children/Member')
const MemberCard = () => import('@/views/sells/children/MemberCard')
const Goods = () => import('@/views/sells/children/Goods')
const GoodsStock = () => import('@/views/sells/children/GoodsStock')
const GoodsPutaway = () => import('@/views/sells/children/GoodsPutaway')

export default [
  {
    path: '/oms/sells',
    name: 'sells_index',
    component: Index,
    redirect: '/oms/sells/member',
    children: [
      {
        path: 'member',
        name: 'member',
        component: Member
      },
      {
        path: 'membercard',
        name: 'membercard',
        component: MemberCard
      },
      {
        path: 'goods',
        name: 'goods',
        component: Goods
      },
      {
        path: 'goodsstock',
        name: 'goodsstock',
        component: GoodsStock
      },
      {
        path: 'goodsputaway',
        name: 'goodsputaway',
        component: GoodsPutaway
      }
    ]
  }

]
