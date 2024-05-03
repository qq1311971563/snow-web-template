import CryptoJS from 'crypto-js'

class SnowUtils {
  md5(data = '') {
    return CryptoJS.MD5(data).toString().toUpperCase()
  }
  createRegexForMaxValue(maxValue) {
    const integerPart = maxValue < 10 ? '0?[1-9]' : maxValue < 100 ? '[1-9]|[1-9][0-9]' : '[1-9]|[1-9][0-9]|1[0-9]{2}'
    const decimalPart = maxValue % 1 === 0 ? '' : `(\\.\\d{1,2})?`
    // 如果maxValue是整数，不需要小数部分；否则，添加小数部分，最多两位
    return new RegExp(`^${integerPart}${decimalPart}$`)
  }
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  /**
   * object 转 formData
   */
  objToForm(obj, formData = new FormData(), parent = '') {
    Object.keys(obj).forEach((key) => {
      if (isObject(obj[key])) {
        this.objToForm(obj[key], formData, key + '.')
      } else if (obj[key] instanceof Array) {
        Object.keys(obj[key]).forEach(innerKey => {
          if (isObject(obj[key][innerKey])) {
            this.objToForm(obj[key][innerKey], formData, parent + key + `[${innerKey}].`)
          } else {
            formData.append(parent + key + `[${innerKey}]`, obj[key][innerKey])
          }
        })
      } else {
        if (obj[key] !== undefined && obj[key] !== null) {
          formData.append(parent + key, obj[key])
        }
      }
    })
    return formData
  }

  /**
   * 递归获取数组某个Key的值
   * @param arr 数组
   * @param key 获取的Key 默认 id
   * @param children 子集标识 默认 children
   * @returns {*[]}
   */
  getArraysByKey(arr = [], key = 'id', children = 'children') {
    const result = []
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (!item[children]) {
        result.push(item[key])
      } else {
        result.push(item[key])
        result.push(...this.getArraysByKey(item[children], key, children))
      }
    }
    return result
  }
}

/**
 * 判断obj是否是 对象
 * @param obj
 * @returns {boolean}
 */
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export default new SnowUtils()
