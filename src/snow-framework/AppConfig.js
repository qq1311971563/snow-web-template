import Cookies from 'js-cookie'
import SnowConfig from '@/snow-config'
class AppConfig {
  baseUrl = '/api';
  version = 'latest';
  devServer = 'http://localhost:8080';
  tokenFlag = 'snow_app_token';
  setToken(token) {
    if (!token) {
      console.log('移除Token')
      Cookies.remove(this.tokenFlag)
      return
    }
    Cookies.set(this.tokenFlag, token)
  }
  getToken() {
    return Cookies.get(this.tokenFlag) || null
  }
  setLoginUser(user) {
    if (!user) {
      Cookies.remove('current_user')
      return
    }
    Cookies.set('current_user', JSON.stringify(user))
  }
  getLoginUser() {
    const cashCurrentUser = Cookies.get('current_user')
    return cashCurrentUser ? JSON.parse(cashCurrentUser) : null
  }
}
let CustomerConfig
if (!SnowConfig) {
  CustomerConfig = new AppConfig()
} else {
  CustomerConfig = Object.assign(new AppConfig(), SnowConfig)
}
console.log(CustomerConfig)
export default CustomerConfig
