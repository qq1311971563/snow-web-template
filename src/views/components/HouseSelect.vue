<script>
import { post } from '@/snow-framework/Request'

export default {
  name: 'HouseSelect',
  props: {
    value: {
      type: [Object, Number],
      default: null
    }
  },
  data() {
    return {
      checkedValue: null,
      loading: false,
      options: []
    }
  },
  methods: {
    async remoteMethod(query) {
      this.options.splice(0, this.options.length)
      this.loading = true
      const result = await post('/community-house/select', {
        page: 1,
        size: 10,
        status: 1,
        fullCode: query
      })
      this.loading = false
      if (!result.success) {
        this.$message.error(result.message)
        return
      }
      this.options = result.data
    },
    onCheckValue(val) {
      const obj = this.options.find(e => e.id === val)
      this.$emit('input', obj)
      this.$emit('change', obj)
    },
    toRefresh() {
      this.$emit('search')
    }
  }
}
</script>

<template>
  <el-form :inline="true">
    <el-form-item label="房屋编号">
      <el-select
        v-model="checkedValue"
        filterable
        remote
        reserve-keyword
        placeholder="请输入房号"
        :remote-method="remoteMethod"
        :loading="loading"
        style="width: 180px"
        @change="onCheckValue"
      >
        <i slot="prefix" class="el-icon-edit el-input__icon" />
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.fullCode"
          :value="item.id"
        >
          <span style="float: left">编号：{{ item.fullCode }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.building.name }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="toRefresh()">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">

</style>
