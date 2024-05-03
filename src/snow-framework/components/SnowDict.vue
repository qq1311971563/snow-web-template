<script>
import { post } from '@/snow-framework/Request'

export default {
  name: 'SnowDict',
  props: {
    value: {
      type: [Object, String, Number, Boolean],
      require: true,
      default: null
    },
    label: {
      type: String,
      default: 'name'
    },
    prop: {
      type: String,
      default: 'id'
    },
    options: {
      type: Array,
      default: () => []
    },
    api: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: null
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tree: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inited: false,
      componentOptions: [],
      checkValue: null
    }
  },
  watch: {
    value: {
      handler: function(val) {
        this.checkValue = val
      }
    }
  },
  async created() {
    await this.init(false)
  },
  methods: {
    async init(refreshApi = false) {
      console.log('重新刷新字典列表')
      if (refreshApi) {
        this.componentOptions.splice(0, this.componentOptions.length)
        const result = await post(this.api, this.params || {})
        if (result.success) {
          this.componentOptions = [...result.data]
        } else {
          this.$message.error(this.label + '选项列表获取失败')
        }
        return
      }
      if (this.options && this.options.length > 0) {
        this.inited = true
        this.componentOptions = [...this.options]
      } else if (this.api) {
        const result = await post(this.api, this.params || {})
        if (result.success) {
          this.componentOptions = [...result.data]
        } else {
          this.$message.error(this.label + '选项列表获取失败')
        }
      } else {
        console.warn('未设置字典值')
        this.componentOptions = []
      }
      if (this.value || this.value === 0) {
        const find = this.componentOptions.find(e => e[this.prop] === this.value)
        if (find) {
          this.checkValue = this.value
        } else {
          this.checkValue = null
        }
      } else {
        this.checkValue = null
      }
    },
    onChange(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>

<template>
  <el-cascader
    v-if="tree"
    v-model="checkValue"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    :options="componentOptions"
    :props="{
      label:label,
      value:prop
    }"
    @change="onChange"
  />
  <el-select v-else v-model="checkValue" :clearable="clearable" :placeholder="placeholder" :disabled="disabled" @change="onChange">
    <el-option v-for="item in componentOptions" :key="item[prop]" :label="item[label]" :value="item[prop]" />
  </el-select>
</template>

<style scoped lang="scss">

</style>
