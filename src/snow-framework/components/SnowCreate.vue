<script>
import SnowDialogButton from '@/snow-framework/components/SnowDialogButton.vue'
import { post } from '@/snow-framework/Request'
import SnowDict from '@/snow-framework/components/SnowDict.vue'

export default {
  name: 'SnowCreate',
  components: { SnowDict, SnowDialogButton },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    createApi: {
      type: [String, Function],
      default: () => {
        return ''
      }
    },
    cleanParams: {
      type: Boolean,
      default: true
    },
    buttonText: {
      type: String,
      default: '新增'
    },
    title: {
      type: String,
      default: '新增'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      inited: false,
      componentOptions: [],
      default: null,
      params: {},
      rules: {}
    }
  },
  created() {
    this.inited = false
    this.params = this.value ? Object.assign({}, this.value) : {}
    this.componentOptions.splice(0, this.componentOptions.length)
    for (let i = 0; i < this.options.length; i++) {
      const item = Object.assign({}, this.options[i])
      if (!item.prop || item.showCreate === false) {
        continue
      }
      if (!item.type) {
        this.$set(item, 'type', 'string')
      }
      this.$set(this.params, item.prop, item.default || (item.default === 0 ? 0 : ''))
      this.$set(this.rules, item.prop, [])
      if (item.require || item.require === undefined) {
        this.rules[item.prop].push({ required: true, message: '请输入' + item.label, trigger: 'blur' })
      }
      if (item.check_phone) {
        this.rules[item.prop].push({ type: 'string', pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' })
        this.$set(item, 'maxlength', 11)
      }
      if (item.check_xm) {
        this.rules[item.prop].push({ type: 'string', pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '请输入正确的姓名', trigger: 'blur' })
      }
      if (item.check_idcard) {
        this.rules[item.prop].push({ type: 'string', pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号', trigger: 'blur' })
        this.$set(item, 'maxlength', 18)
      }
      this.componentOptions.push(item)
    }
    this.default = Object.assign({}, this.params)
    this.inited = true
  },
  methods: {
    async toCreate() {
      try {
        await this.$refs.form.validate()
      } catch (e) {
        console.warn('表单校验未通过', e)
        return
      }
      const reqParams = Object.assign({}, this.params, this.value)
      this.$emit('input', this.params)
      if (typeof this.createApi === 'function') {
        return await this.createApi.call(this.$parent, reqParams, this.params)
      }
      const result = await post(this.createApi, reqParams)
      if (!result.success) {
        this.$message.error(result.message)
        return
      }
      if (this.cleanParams) {
        this.params = Object.assign({}, this.default)
      }
      this.$message.success('创建成功')
      this.$emit('success')
      this.params = Object.assign({}, this.default)
      return true
    },
    fieldChange(item) {
      if (item.type === 'dict' && item.linkProp) {
        const component = this.$refs['dict-' + item.linkProp]
        if (component && Object.keys(component).length === 1) {
          component[0].init(true)
        } else {
          component.init(true)
        }
        this.params[item.linkProp] = null
      }
    }
  }
}
</script>

<template>
  <snow-dialog-button :disabled="disabled" :button-text="buttonText" button-type="primary" :title="title" button-icon="el-icon-plus" :plain="true" :do-confirm="toCreate">
    <el-form v-if="inited" ref="form" :model="params" label-position="right" :label-width="'100px'" :rules="rules">
      <el-form-item
        v-for="(item, index) in componentOptions"
        :key="'update-' + item.prop + '-' + index"
        :label="item.label"
        :prop="item.prop"
      >
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="params[item.prop]"
          value-format="yyyy-MM-dd"
          :placeholder="item.placeholder || '请选择' + item.label"
        />
        <el-date-picker
          v-else-if="item.type === 'datetime'"
          v-model="params[item.prop]"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="item.placeholder || '请选择' + item.label"
        />
        <el-input v-else-if="item.type === 'textarea'" v-model="params[item.prop]" type="textarea" :placeholder="item.placeholder || '请输入' + item.label" :maxlength="item.maxlength || 500" show-word-limit />
        <component :is="item.component" v-else-if="item.type === 'component'" v-model="params[item.prop]" />
        <el-input-number v-else-if="item.type ==='number'" v-model="params[item.prop]" :min="item.min" :max="item.max" />
        <el-input-number v-else-if="item.type ==='float'" v-model="params[item.prop]" :precision="2" :step="0.05" />
        <snow-dict
          v-else-if="item.type === 'dict'"
          :ref="'dict-' + item.prop"
          v-model="params[item.prop]"
          :params="item.params || params"
          :options="item.options"
          :api="item.api"
          :label="item.dictLabel"
          :value="item.dictProp"
          :placeholder="item.placeholder || '请选择' + item.label"
          :clearable="item.clearable === undefined ? true : item.clearable"
          :tree="item.tree"
          @change="fieldChange(item)"
        />
        <el-input v-else v-model="params[item.prop]" :placeholder="item.placeholder || '请输入' + item.label" :maxlength="item.maxlength || 100" show-word-limit />
      </el-form-item>
    </el-form>
  </snow-dialog-button>
</template>

<style scoped lang="scss">

</style>
