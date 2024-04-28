import messageBox from 'element-ui/packages/message-box'
import { Loading } from 'element-ui'

const EleInstance = {
  LoadingInstance: null
}

/**
 * @param message 描述信息
 * @param title 标题
 * @param api 执行函数
 * @param options 其他设置： confirmText cancelText
 * @returns {*}
 */
export function confirm(message, title, api, options = {}) {
  return messageBox.confirm(message, title, {
    confirmText: options.confirmText || '确定',
    cancelText: options.cancelText || '取消',
    type: 'warning',
    beforeClose: async(action, instance, done) => {
      if ((action === 'confirm')) {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '执行中...'
        const result = await api.apply(this)
        instance.confirmButtonText = '确定'
        instance.confirmButtonLoading = false
        instance.confirmButtonText = options.confirmText
        if (result) {
          done()
        }
      } else {
        done()
      }
    }
  })
}

export function prompt(message, title, api, inputPattern, inputErrorMessage) {
  return messageBox.prompt(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: inputPattern,
    inputErrorMessage: inputErrorMessage,
    beforeClose: async(action, instance, done) => {
      if ((action === 'confirm')) {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '执行中...'
        api.apply(this, [instance.inputValue]).then(result => {
          instance.confirmButtonLoading = false
          instance.confirmButtonText = '确定'
          if (result) {
            done()
          }
        })
      } else {
        done()
      }
    }
  })
}

export function loading(message = '加载中') {
  EleInstance.LoadingInstance = Loading.service({
    lock: true,
    text: message,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  return EleInstance.LoadingInstance
}

export default {
  confirm,
  prompt,
  loading
}
