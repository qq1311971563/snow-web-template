import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import appConfig from '@/snow-framework/AppConfig'
import store from './store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // 1 先判断是否登录，未登录，判断该路由是否白名单，是白名单，允许跳转，非白名单，跳转登录页
  // 2 登录判断，是否加载过动态权限列表，否加载列表，然后 判断路由是否存在，不存在跳转404
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = appConfig.getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (!store.getters.permission_routes || store.getters.permission_routes.length === 0) {
        await store.dispatch('user/generateRouters')
        next({ ...to, replace: true })
      } else {
        next()
      }
    }
    NProgress.done()
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
    NProgress.done()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
