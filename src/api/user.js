import { post } from '@/snow-framework/Request'

export function login(data) {
  return post('/auth/login', data)
}

export function getInfo() {
  return post('/auth/get-userinfo')
}

export function logout() {
  return post('/auth/logout')
}
