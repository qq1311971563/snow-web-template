<script>
import { post } from '@/snow-framework/Request'
import ElementUtils from '@/snow-framework/ElementUtils'

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
      default: 'small'
    },
    params: {
      type: [Object, Number, String],
      default: null
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
      ElementUtils.confirm(this.confirmText, '提示', async(action, instance, done) => {
        this.loading = true
        const result = await post(this.api, this.params)
        this.loading = false
        if (result.success) {
          this.$emit('success')
          this.$message.success('操作成功')
          return result.success
        }
        this.$message.error(result.message)
        return result.success
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
