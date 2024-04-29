<script>
import SnowDialogButton from '@/snow-framework/components/SnowDialogButton.vue'
import SnowTable from '@/snow-framework/components/SnowTable.vue'
import { post } from '@/snow-framework/Request'

export default {
  name: 'AddFeeItem',
  components: { SnowTable, SnowDialogButton },
  props: {
    houseId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      selected: [],
      beginDate: null,
      expiredDate: null
    }
  },
  methods: {
    async toConfirm() {
      const result = await post('/community-house/add-fee-item', { houseId: this.houseId,
        feeIds: this.selected.map(e => e.id),
        beginDate: this.beginDate,
        expiredDate: this.expiredDate }
      )
      if (!result.success) {
        this.$message.error(result.message)
        return false
      }
      this.$emit('success')
      this.$message.success('添加成功')
      await this.$refs.table.refresh()
      return true
    }
  }
}
</script>

<template>
  <snow-dialog-button button-text="添加费用项" :dis-confirm="selected.length === 0" :do-confirm="toConfirm">
    <el-form :inline="true">
      <el-form-item label="费用起始日期">
        <el-date-picker
          v-model="beginDate"
          :default-value="new Date()"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="费用起始日期"
        />
      </el-form-item>
      <el-form-item label="费用结束日期">
        <el-date-picker v-model="expiredDate" value-format="yyyy-MM-dd" type="date" placeholder="费用结束日期" />
      </el-form-item>
    </el-form>
    <snow-table
      ref="table"
      query-api="/community-fee-item/page"
      :selected.sync="selected"
      :query-params="{
        houseId:houseId,
        houseFilter: true
      }"
      :options="[
        {label:'收费项',prop:'name'},
        {label:'收费周期',prop:'feeCycle',type:'dict',options:[{name:'按月收费',id:1},{name:'按季度收费',id:2},{name:'按年收费',id:3}]},
        {label:'收费数量',prop:'feeNum', type: 'Number'},
        {label:'收费价格',prop:'feePrice',type:'money'},
        {label:'计算规则',prop:'feeRule', type: 'dict', options:[{name:'单价*数量*建筑面积',id:1},{name:'单价*数量',id:2}]}
      ]"
    />
  </snow-dialog-button>
</template>

<style scoped lang="scss">

</style>
