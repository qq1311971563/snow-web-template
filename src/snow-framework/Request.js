import axios from 'axios'
import SnowUtils from '@/snow-framework/SnowUtils'
import Cookies from 'js-cookie'
import appConfig from './AppConfig'
import { MessageBox } from 'element-ui'
import store from '@/store'

const TraceKey = 'snow_app_trace'
const TraceNumKey = 'snow_app_trace-num'
const service = axios.create({
  baseURL: appConfig.baseUrl, // url = base url + request url
  timeout: 30000,
  headers: {
    version: appConfig.version
  }
})
let disableReLoginDialog = false
export function getTrace() {
  const trace = Cookies.get(TraceKey) || Math.random() * 1000000000000000000
  const num = Number.parseInt(Cookies.get(TraceNumKey)) || 0
  Cookies.set(TraceKey, trace)
  Cookies.set(TraceNumKey, num + 1)
  return `${trace}-${num + 1}`
}

function genVerifyContent(nonce, timestamp, data) {
  const contentData = `nonce=[${nonce}]&timestamp=[${timestamp}]`
  return SnowUtils.md5(contentData)
}

service.interceptors.request.use(config => {
  let accessVersion = Cookies.get('accessVersion')
  if (!accessVersion) {
    accessVersion = process.env.VUE_APP_ACCESS_VERSION || 'latest'
    Cookies.set('accessVersion', accessVersion)
  }
  config.headers['client-version'] = config.clientVersion || 'latest'
  config.headers['version'] = accessVersion
  config.headers['x-trace'] = getTrace()
  const timestamp = new Date().getTime()
  config.headers['x-timestamp'] = timestamp
  const nonce = SnowUtils.uuid()
  config.headers['x-nonce'] = nonce
  if (config.method === 'get') {
    config.headers['x-sign'] = genVerifyContent(nonce, timestamp, config.params)
  } else {
    if (config.headers['Content-Type']?.includes('multipart/form-data')) {
      // 表单格式，内容不参与加密
      config.headers['x-sign'] = genVerifyContent(nonce, timestamp, '')
    } else {
      config.headers['x-sign'] = genVerifyContent(nonce, timestamp, config.data)
    }
  }
  if (appConfig.getToken()) {
    config.headers['Authorization'] = appConfig.getToken()
  }
  return config
}, error => {
  return { status: error.response.status, success: false, message: '请求发送失败，请检查您的网络' }
})

service.interceptors.response.use(response => {
  if (!response.data) {
    return {
      status: -1,
      success: false,
      message: '服务器返回数据为空，请联系现场工程师或信息科'
    }
  }
  return response.data
}, error => {
  console.error('请求发生异常，请及时处理', error, error.message)
  if (error.message.includes('timeout')) {
    return { status: 500, success: false, message: '服务器连接超时，请稍后再试' }
  }
  if (error.message.includes('Network Error')) {
    return { status: 500, success: false, message: '网络连接中断，请稍后再试' }
  }
  if (error.response.status === 401) {
    console.log(error.request, '??', Object.keys(error), error.config)
    if (!disableReLoginDialog) {
      MessageBox.confirm('令牌状态已过期，请重新登录!', '系统提示', {
        confirmButtonText: '重新登录',
        type: 'error',
        showClose: false,
        closeOnClickModal: false,
        showCancelButton: false
      })
        .then(async() => {
          disableReLoginDialog = true
          setTimeout(() => {
            disableReLoginDialog = false
          }, 800)
          await store.dispatch('user/logout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // location.reload()
        })
        .catch(() => {
        })
    }
    return { status: error.response.status, success: false, message: '您尚未登录或您的登录信息已过期，请您重新登录' }
  }
  if (error.response.status === 403) {
    return { status: error.response.status, success: false, message: '非法操作' }
  }
  if (error.response.status === 404) {
    return { status: error.response.status, success: false, message: '资源不存在，请联系现场工程师或系统管理员' }
  }
  if (error.response.status === 500) {
    return { status: error.response.status, success: false, message: '服务器内部异常，请联系现场工程师或系统管理员' }
  }
  if (error.response.status === 503) {
    return {
      status: error.response.status, success: false, message: '远程服务已关闭或正在维护，请联系现场工程师或系统管理员'
    }
  }
  return {
    status: error.response.status,
    success: false,
    message: '服务器发生错误[' + error.response.status + ']，请联系现场工程师'
  }
})

export function get(url, data) {
  return service({
    url: url,
    method: 'get',
    params: data
  })
}

export function post(url, data) {
  return service({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function postForm(url, data) {
  return service({
    url: url,
    method: 'post',
    data: SnowUtils.objToForm(data),
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
