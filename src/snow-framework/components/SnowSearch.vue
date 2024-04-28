<script>
import SnowDict from '@/snow-framework/components/SnowDict.vue'

export default {
  name: 'SnowSearch',
  components: { SnowDict },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    queryFun: {
      type: Function,
      require: true,
      default: () => false
    }
  },
  data() {
    return {
      params: {},
      default: {},
      componentOptions: [],
      inited: false,
      searching: false
    }
  },
  created() {
    this.inited = false
    this.params = Object.assign({}, this.value)
    for (let i = 0; i < this.options.length; i++) {
      const item = Object.assign({}, this.options[i])
      if (!item.prop || item.isSearch === false) {
        continue
      }
      if (!item.type) {
        this.$set(item, 'type', 'string')
      }
      if (item.clearable !== false) {
        this.$set(item, 'clearable', true)
      }
      this.$set(this.params, this.options[i].prop, this.params[item.prop] || this.options[i].default || null)
      this.componentOptions.push(this.options[i])
    }
    this.inited = true
  },
  methods: {
    async onSearch() {
      this.$emit('input', this.params)
      this.searching = true
      await this.queryFun.call(this.$parent, this.params)
      this.searching = false
    },
    onReset() {
      this.params = Object.assign({}, this.default)
      this.$emit('onReset')
    }
  }
}
</script>

<template>
  <div v-if="componentOptions.length > 0">
    <div v-if="inited">
      <el-form :inline="true" size="small">
        <el-form-item
          v-for="(item) in componentOptions"
          :key="'search-' + item.prop"
          :label="item.label"
          :prop="item.prop"
        >
          <el-date-picker
            v-if="item.type === 'date'"
            v-model="params[item.prop]"
            value-format="yyyy-MM-dd"
            :placeholder="item.placeholder || '点击选择日期'"
            :clearable="item.clearable"
          />
          <el-date-picker
            v-else-if="item.type === 'year'"
            v-model="params[item.prop]"
            type="year"
            value-format="yyyy"
            :placeholder="item.placeholder || '点击选择年份'"
            :clearable="item.clearable"
          />
          <el-date-picker
            v-else-if="item.type === 'month'"
            v-model="params[item.prop]"
            type="month"
            value-format="yyyy-MM"
            :placeholder="item.placeholder || '点击选择年份'"
            :clearable="item.clearable"
          />
          <snow-dict v-else-if="item.type === 'dict'" v-model="params[item.prop]" :options="item.options" :placeholder="item.placeholder || '选择' + item.label + '进行检索'" />
          <el-input
            v-else
            v-model="params[item.prop]"
            :maxlength="item.maxlength"
            :placeholder="item.placeholder || '输入' + item.label + '进行检索'"
            :clearable="item.clearable"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" :loading="searching" @click="onSearch">查询
          </el-button>
          <el-button icon="el-icon-reset" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-skeleton v-else :rows="6" animated />
  </div>
</template>

<style scoped lang="scss">

</style>
