/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const snowDemoRouter = {
  path: '/snow-framework',
  component: Layout,
  redirect: 'noRedirect',
  name: 'snow框架',
  meta: {
    title: 'snow框架',
    icon: 'component'
  },
  children: [
    {
      path: 'snow-crud-demo',
      component: () => import('@/views/snow-framework-demo/SnowCrudDemo'),
      name: 'SnowCrud组件',
      meta: { title: 'SnowCrud组件', requireAuth: true }
    },
    {
      path: 'snow-button-demo',
      component: () => import('@/views/snow-framework-demo/SnowButtonDemo'),
      name: 'SnowButton组件',
      meta: { title: 'SnowButton组件', requireAuth: true }
    }
  ]
}

export default snowDemoRouter
