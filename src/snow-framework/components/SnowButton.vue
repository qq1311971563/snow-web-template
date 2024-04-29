<script>
import { post } from '@/snow-framework/Request'

export default {
  name: 'SnowButton',
  props: {
    api: {
      type: [String, Function],
      default: ''
    },
    type: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    },
    plain: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: '未定义'
    },
    params: {
      type: [Object, Number, String],
      default: null
    },
    prompt: {
      type: Boolean,
      default: false
    },
    inputPattern: {
      type: RegExp,
      default: null
    },
    inputErrorMessage: {
      type: String,
      default: ''
    },
    promptValueKey: {
      type: String,
      default: null
    },
    inputPlaceholder: {
      type: String,
      default: '请输入'
    }
  },
  data() {
    return {
      confirming: false
    }
  },
  methods: {
    async onClick() {
      if (typeof this.api === 'function') {
        this.confirming = true
        await this.api.call(this.$parent, this.params)
        this.confirming = false
        return
      }
      if (this.prompt) {
        this.$prompt(this.confirmText, '提示', {
          type: 'warning',
          inputPlaceholder: this.inputPlaceholder,
          beforeClose: async(action, instance, done) => {
            if ((action === 'confirm')) {
              if (!instance.inputValue) {
                return
              }
              const temp = { ...this.params, [this.promptValueKey]: instance.inputValue }
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              const result = await post(this.api, temp)
              // eslint-disable-next-line require-atomic-updates
              instance.confirmButtonText = '确定'
              // eslint-disable-next-line require-atomic-updates
              instance.confirmButtonLoading = false
              if (!result.success) {
                this.$message.error(result.message)
              } else {
                this.$message.success('操作成功')
                this.$emit('success')
              }
              if (result.success) {
                done()
              }
            } else {
              done()
            }
          }
        })
        return
      }
      await this.$confirm(this.confirmText, '提示', {
        type: 'warning',
        beforeClose: async(action, instance, done) => {
          if ((action === 'confirm')) {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            const result = await post(this.api, this.params)
            if (!result.success) {
              this.$message.error(result.message)
            } else {
              this.$message.success('操作成功')
              this.$emit('success')
            }
            instance.confirmButtonText = '确定'
            instance.confirmButtonLoading = false
            if (result.success) {
              done()
            }
          } else {
            done()
          }
        }
      })
    }
  }
}
</script>

<template>
  <el-button :type="type" :icon="icon" :size="size" :plain="plain" :loading="confirming" :disabled="disabled" @click="onClick"><slot /></el-button>
</template>

<style scoped lang="scss">

</style>
