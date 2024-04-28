
import Layout from '@/layout'

const snowFrameworkRouter = [
  {
    path: '/system-manager',
    component: Layout,
    redirect: 'noRedirect',
    name: '系统管理',
    meta: {
      title: '系统管理',
      icon: 'component'
    },
    children: [
      {
        path: 'tenant-manager',
        component: () => import('@/snow-framework/page/system/tenant/index'),
        name: '租户管理',
        meta: { title: '租户管理', requireAuth: true }
      },
      {
        path: 'dept-manager',
        component: () => import('@/snow-framework/page/system/dept/index'),
        name: '部门管理',
        meta: { title: '部门管理', requireAuth: true }
      },
      {
        path: 'role-manager',
        component: () => import('@/snow-framework/page/system/role/index'),
        name: '角色管理',
        meta: { title: '角色管理', requireAuth: true }
      },
      {
        path: 'user-manager',
        component: () => import('@/snow-framework/page/system/user/index'),
        name: '用户管理',
        meta: { title: '用户管理', requireAuth: true }
      }
    ]
  }
]

export default snowFrameworkRouter
