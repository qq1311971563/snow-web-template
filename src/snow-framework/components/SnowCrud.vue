<script>
import SnowTable from '@/snow-framework/components/SnowTable.vue'
import SnowUpdate from '@/snow-framework/components/SnowUpdate.vue'
import SnowSearch from '@/snow-framework/components/SnowSearch.vue'
import SnowCreate from '@/snow-framework/components/SnowCreate.vue'
import { post } from '@/snow-framework/Request'

/**
 * options 列设置 对象列表
 * {
 * prop:'',
 * type: '(类型)string,date,number,dict',
 * label:'标签',为空使用prop
 * isSearch:true,false 默认为false
 * default: 默认为null
 * maxlength:默认为30,number时为上限，dict或date时无效
 * page:是否支持分页，默认支持
 * placeholder:默认为请输入或请选择
 * }
 * page 是否支持分页，默认不支持
 * create-api 创建api 支持string或function，为空表示不支持创建
 * query-api 查询api 支持string或function，为空表示不支持查询
 * update-api 更新api 支持string或function，为空表示不支持更新
 * delete-api 删除api 支持string或function，为空表示不支持删除
 */
export default {
  name: 'SnowCrud',
  components: { SnowCreate, SnowSearch, SnowUpdate, SnowTable },
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
    createApi: {
      type: [String, Function],
      default: () => {
        return ''
      }
    },
    createButtonText: {
      type: String,
      default: '新增'
    },
    createTitle: {
      type: String,
      default: '新增'
    },
    queryApi: {
      type: [String, Function],
      default: () => {
        return ''
      }
    },
    updateApi: {
      type: [String, Function],
      default: () => {
        return ''
      }
    },
    deleteApi: {
      type: [String, Function],
      default: ''
    },
    batchDeleteApi: {
      type: [String],
      default: ''
    },
    delPromptKey: {
      type: String,
      default: () => {
        return ''
      }
    },
    tableExtra: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      componentOptions: [],
      inited: false,
      searchParams: {},
      searching: false
    }
  },
  computed: {
  },
  async created() {
    for (let i = 0; i < this.options.length; i++) {
      const ele = Object.assign({}, this.options[i])
      if (!ele.prop) {
        console.warn('prop不能为空，忽略该项')
        continue
      }
      // 添加默认类型
      if (!ele.type) {
        this.$set(ele, 'type', 'string')
      }
      if (ele.type === 'dict' && ele.api) {
        const result = await post(ele.api, {})
        if (result.success) {
          this.$set(ele, 'options', result.data)
        }
      }
      if (!ele.label) {
        this.$set(ele, 'label', ele.prop)
      }
      if (!ele.maxlength) {
        this.$set(ele, 'maxlength', 30)
      }
      if (!ele.page) {
        this.$set(ele, 'page', false)
      }
      if (!ele.isSearch) {
        this.$set(ele, 'isSearch', false)
      }
      this.componentOptions.push(ele)
    }
    setTimeout(() => {
      this.inited = true
    }, 500)
  },
  methods: {
    async refresh() {
      return this.$refs.table.refresh()
    },
    async onSearch(params) {
      this.searchParams = params
      await this.refresh()
    },
    toUpdate(row) {
      this.$refs.update.toUpdate(row)
    },
    async toCreate(val) {
      return await this.createApi.call(this.$parent, val)
    },
    async toDelete(val) {
      return await this.createApi.call(this.$parent, val)
    }
  }
}
</script>

<template>
  <div class="view-container">
    <snow-search v-if="inited" :options="componentOptions" :query-fun="onSearch" />
    <snow-create
      v-if="inited && createApi"
      ref="create"
      :options="componentOptions"
      :create-api=" typeof createApi === 'string' ? createApi : toCreate"
      :title="createTitle"
      :button-text="createButtonText"
      @success="refresh"
    />
    <snow-update v-if="inited && updateApi" v-show="false" ref="update" :options="componentOptions" :update-api="updateApi" @success="refresh" />
    <div v-if="inited" class="content-div">
      <snow-table
        ref="table"
        :page="page"
        :query-params="searchParams"
        :query-api="queryApi"
        :update-fun="updateApi ? toUpdate : ''"
        :delete-api="typeof deleteApi === 'string' ? deleteApi : toDelete"
        :options="componentOptions"
        :del-prompt-key="delPromptKey"
        :extra="tableExtra"
      >
        <template v-slot:rowAction="{row}">
          <slot name="rowAction" :row="row" />
        </template>
      </snow-table>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "../main.css";

.content-div {
  flex: 1;
}
</style>
