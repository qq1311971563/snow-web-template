<script>

import { post } from '@/snow-framework/Request'
import SnowButton from '@/snow-framework/components/SnowButton.vue'

export default {
  name: 'SnowTable',
  components: { SnowButton },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    page: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    initData: {
      type: Boolean,
      default: true
    },
    queryParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    queryApi: {
      type: [String, Function],
      default: () => {
        return ''
      }
    },
    updateFun: {
      type: [Function],
      default: null
    },
    deleteApi: {
      type: [String, Function],
      default: () => {
        return ''
      }
    },
    delPromptKey: {
      type: String,
      default: () => {
        return ''
      }
    },
    checked: {
      type: [Object, undefined],
      default: undefined
    },
    selected: {
      type: Array,
      default: null
    },
    enableAction: {
      type: Boolean,
      default: false
    },
    minHeight: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      querying: false,
      tableData: [],
      componentOptions: [],
      inited: false,
      pageInfo: {
        page: 1,
        size: 10,
        total: 0,
        totalPage: 0
      }
    }
  },
  created() {
    for (let i = 0; i < this.options.length; i++) {
      const item = Object.assign({}, this.options[i])
      if (!item.prop || item.showView === false) {
        continue
      }
      this.componentOptions.push(item)
    }
    if (this.initData) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      if (typeof this.queryApi === 'function') {
        this.querying = true
        const result = await this.queryApi.call(this.$parent, this.queryParams)
        this.querying = false
        this.tableData = result
        return
      }
      const reqParams = this.page ? { ...this.queryParams, ...this.pageInfo } : { ...this.queryParams }
      this.querying = true
      const result = await post(this.queryApi, reqParams)
      this.querying = false
      if (!result.success) {
        this.$message.error(result.message)
        this.tableData = []
        this.pageInfo.page = 1
        this.pageInfo.total = 0
        this.pageInfo.totalPage = 0
        return
      }
      this.tableData = this.page ? result.data.list : result.data
      if (this.page) {
        this.pageInfo.page = result.data.page
        this.pageInfo.size = result.data.size || this.pageInfo.size
        this.pageInfo.total = result.data.total
        this.pageInfo.totalPage = result.data.totalPage || result.data.total / result.data.size
      }
    },
    handleSizeChange(val) {
      this.pageInfo.size = val
    },
    handleCurrentChange(val) {
      this.pageInfo.page = val
      this.refresh()
    },
    checkedRowChange(val) {
      console.log('选中当前行', val)
      this.$emit('update:checked', val)
    },
    toUpdate(row, $index) {
      this.updateFun.call(this.$parent, row, $index)
    },
    toDelete(params) {
      this.deleteApi.call(this.$parent, params)
    },
    handleSelectionChange(rows) {
      this.$emit('update:selected', rows)
    },
    dictFind(configItem, row) {
      if (configItem.options) {
        const findVal = configItem.options.find(e => e[configItem.dictProp || 'id'] === row[configItem.prop])
        if (findVal) {
          return findVal[configItem.dictLabel || 'name']
        } else {
          return '\\'
        }
      } else {
        return '\\'
      }
    }
  }
}
</script>

<template>
  <div
    v-loading="querying"
    style="height: 100%;"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <el-table
      style="height: calc(100% - 40px);margin-top: 6px"
      :data="tableData"
      :highlight-current-row="checked !== undefined"
      :highlight-selection-row="true"
      :style="{minHeight: minHeight}"
      @selection-change="handleSelectionChange"
      @current-change="checkedRowChange"
    >
      <el-table-column v-if="selected" type="selection" />
      <el-table-column type="index" label="序号" />
      <el-table-column
        v-for="item in componentOptions"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :align="item.align"
        :sortable="item.sortable"
        :show-overflow-tooltip="item.showOverflowTooltip === undefined ? true : item.showOverflowTooltip"
      >
        <template v-slot="{row}">
          <span v-if="item.type === 'date'">
            {{ row[item.prop] ? row[item.prop].substring(0, 10) : '\\' }}
          </span>
          <span v-else-if="item.type === 'dict'">
            {{ dictFind(item, row) }}
          </span>
          <slot v-else-if="item.type === 'slot'" :name="item.slot" />
          <span v-else>
            {{ row[item.prop] ? row[item.prop] : (row[item.prop] === 0 ? '0' : '\\') }}
          </span>
        </template>
      </el-table-column>
      <slot />
      <el-table-column v-if="enableAction || deleteApi || updateFun" label="操作">
        <template v-slot="{row, $index}">
          <el-button v-if="updateFun" size="small" type="text" @click="toUpdate(row, $index)">更新</el-button>
          <snow-button
            v-if="deleteApi"
            type="text"
            class="delete-button-color"
            :params="row.id"
            :api="typeof deleteApi === 'string' ? deleteApi : toDelete"
            :confirm-text="`确定删除【${row[delPromptKey]}】吗？`"
            @success="refresh"
          >删除</snow-button>
          <slot name="rowAction" :row="row" />
        </template>
      </el-table-column>
    </el-table>
    <div v-if="page" style="height: 34px;text-align: right;margin-top: 10px">
      <el-pagination
        :current-page="pageInfo.page"
        :page-sizes="[10, 50, 100, 300]"
        :page-size="pageInfo.size"
        :layout="pageInfo.totalPage > 20 ? 'total, sizes, prev, pager, next, jumper' : 'total, sizes, prev, pager, next'"
        :total="pageInfo.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "~@/snow-framework/main.css";
</style>
