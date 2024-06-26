import Layout from '@/layout/index.vue'

const communityRouters = [
  {
    path: '/community-config',
    component: Layout,
    redirect: 'noRedirect',
    name: '社区配置',
    meta: {
      title: '社区配置',
      icon: 'component'
    },
    children: [
      {
        path: 'community-area-management',
        component: () => import('@/views/community-config/area-management'),
        name: '区域管理',
        meta: {
          title: '区域管理', requireAuth: true,
          buttonAuth: [
            { auth: 'area-create', name: '创建' },
            { auth: 'area-update', name: '更新' },
            { auth: 'area-delete', name: '删除' }
          ]
        }
      },
      {
        path: 'community-building-management',
        component: () => import('@/views/community-config/building-management'),
        name: '楼栋管理',
        meta: {
          title: '楼栋管理', requireAuth: true,
          buttonAuth: [
            { auth: 'building-create', name: '创建' },
            { auth: 'building-update', name: '更新' },
            { auth: 'building-delete', name: '删除' }
          ]
        }
      },
      {
        path: 'community-house-management',
        component: () => import('@/views/community-config/house-management'),
        name: '房屋管理',
        meta: {
          title: '房屋管理', requireAuth: true,
          buttonAuth: [
            { auth: 'house-create', name: '创建' },
            { auth: 'house-update', name: '更新' },
            { auth: 'house-delete', name: '删除' }
          ]
        }
      },
      {
        path: 'community-owner-management',
        component: () => import('@/views/community-config/owner-management'),
        name: '业主管理',
        meta: {
          title: '业主管理', requireAuth: true,
          buttonAuth: [
            { auth: 'house-create', name: '创建' },
            { auth: 'house-update', name: '更新' },
            { auth: 'house-delete', name: '删除' }
          ]
        }
      }
    ]
  },
  {
    path: '/pay-config',
    component: Layout,
    redirect: 'noRedirect',
    name: '支付配置',
    meta: {
      title: '社区配置',
      icon: 'component'
    },
    children: [
      {
        path: 'pay-item-config',
        component: () => import('@/views/pay-config/pay-item-config'),
        name: '收费项维护',
        meta: { title: '收费项维护', requireAuth: true }
      }
    ]
  },
  {
    path: '/checkout-counter',
    component: Layout,
    redirect: 'noRedirect',
    name: '收银台',
    meta: {
      title: '收银台',
      icon: 'component'
    },
    children: [
      {
        path: 'main',
        component: () => import('@/views/checkout-counter/main'),
        name: '收银台',
        meta: { title: '收银台', requireAuth: true }
      }
    ]
  }
]

export default communityRouters
