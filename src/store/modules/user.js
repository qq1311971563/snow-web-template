import { login, logout, getInfo } from '@/api/user'
import router, { asyncRoutes, constantRoutes, resetRouter } from '@/router'
import appConfig from '@/snow-framework/AppConfig'
import { filterAsyncRoutes } from '@/store/modules/permission'

const state = {
  token: appConfig.getToken(),
  loginUser: appConfig.getLoginUser(),
  name: '',
  avatar: '',
  introduction: '',
  systemAdmin: false,
  roles: [],
  routers: [],
  dynamicRouters: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    appConfig.setToken(token)
  },
  SET_LOGIN_USER: (state, userInfo) => {
    state.loginUser = userInfo
    appConfig.setLoginUser(userInfo)
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROUTERS(state, routers) {
    resetRouter()
    router.addRoutes(routers)
    state.dynamicRouters = routers
    state.routers = constantRoutes.concat(routers)
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const loginResult = await login({ account: username.trim(), password: password })
    if (!loginResult.success) {
      throw new Error(loginResult.message)
    }
    commit('SET_TOKEN', loginResult.data)
    const userInfoResult = await getInfo()
    if (!userInfoResult.success) {
      commit('SET_TOKEN', '')
      throw new Error(userInfoResult.message)
    }
    const loginUser = userInfoResult.data
    commit('SET_LOGIN_USER', loginUser)
    commit('SET_NAME', loginUser.name)
    commit('SET_AVATAR', loginUser.avatar)
    commit('SET_INTRODUCTION', '用户描述')
    let accessedRoutes
    if (loginUser.systemAdmin) {
      accessedRoutes = asyncRoutes
    } else {
      console.log('Are you ok?', loginUser.permissions)
      accessedRoutes = filterAsyncRoutes(asyncRoutes, loginUser.permissions)
    }
    commit('SET_ROUTERS', accessedRoutes)
  },
  async generateRouters({ commit, state }) {
    let accessedRoutes
    if (state.loginUser.systemAdmin) {
      accessedRoutes = asyncRoutes
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, state.loginUser.permissions)
    }
    commit('SET_ROUTERS', accessedRoutes)
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_LOGIN_USER', null)
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_NAME', '')
        commit('SET_ROUTERS', [])
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
