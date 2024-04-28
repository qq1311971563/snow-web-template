<script>
import SnowDialog from '@/snow-framework/components/SnowDialogButton.vue'
import { post } from '@/snow-framework/Request'
import SnowDict from '@/snow-framework/components/SnowDict.vue'

export default {
  name: 'SnowUpdate',
  components: { SnowDict, SnowDialog },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    updateApi: {
      type: [String, Function],
      require: true,
      default: null
    }
  },
  data() {
    return {
      componentOptions: [],
      rules: {},
      params: {},
      default: {
        params: null
      },
      inited: false
    }
  },
  methods: {
    toUpdate(row) {
      console.log('Are you update?', row)
      this.inited = false
      this.params = Object.assign({}, row)
      this.componentOptions.splice(0, this.componentOptions.length)
      for (let i = 0; i < this.options.length; i++) {
        const item = Object.assign({}, this.options[i])
        if (!item.prop || item.showUpdate === false) {
          console.warn('该字段未设置prop或限制更新', item)
          continue
        }
        if (!item.type) {
          item.type = 'string'
        }
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
      this.default.params = Object.assign({}, this.params)
      this.$refs.dialog.visible = true
      this.inited = true
    },
    async toConfirm() {
      try {
        await this.$refs.form.validate()
      } catch (e) {
        console.warn('表单校验未通过', e)
        return
      }
      if (typeof this.updateApi === 'function') {
        return await this.updateApi.call(this.$parent, this.params)
      } else {
        const result = await post(this.updateApi, this.params)
        if (result.success) {
          this.$emit('success')
          return true
        } else {
          this.$message.error(result.message)
        }
      }
    },
    fieldChange(item) {
      if (item.type === 'dict' && item.linkProp) {
        const component = this.$refs['dict-' + item.linkProp]
        console.log('Are you ok?', component)
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
  <snow-dialog ref="dialog" :do-confirm="toConfirm" button-text="更新" title="更新">
    <el-form v-if="inited" ref="form" :model="params" :label-position="'right'" :label-width="'100px'" :rules="rules">
      <el-form-item
        v-for="(item, index) in componentOptions"
        :key="'update-' + item.prop + '-' + index + '-' + params.id"
        :label="item.label"
        :prop="item.prop"
      >
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="params[item.prop]"
          value-format="yyyy-MM-dd"
        />
        <el-input v-else-if="item.type === 'textarea'" v-model="params[item.prop]" type="textarea" :placeholder="item.placeholder || '请输入' + item.label" :maxlength="item.maxlength || 500" />
        <component :is="item.component" v-else-if="item.type === 'component'" v-model="params[item.prop]" />
        <el-input-number v-else-if="item.type ==='number'" v-model="params[item.prop]" />
        <el-input-number v-else-if="item.type ==='float'" v-model="params[item.prop]" :precision="2" :step="0.05" />
        <snow-dict v-else-if="item.type === 'dict'" :ref="'dict-' + item.prop" v-model="params[item.prop]" :params="params" :options="item.options" :api="item.api" :label="item.dictLabel" :value="item.dictProp" :placeholder="item.placeholder || '请选择' + item.label" @change="fieldChange(item)" />
        <el-input v-else v-model="params[item.prop]" :placeholder="item.placeholder || '请输入' + item.label" :maxlength="item.maxlength || 100" :show-word-limit="true" />
      </el-form-item>
    </el-form>
  </snow-dialog>
</template>

<style scoped lang="scss">

</style>
