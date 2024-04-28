<script>
import SnowDialogButton from '@/snow-framework/components/SnowDialogButton.vue'
import SnowTable from '@/snow-framework/components/SnowTable.vue'
import { post } from '@/snow-framework/Request'

export default {
  name: 'LinkOwner',
  components: { SnowTable, SnowDialogButton },
  props: {
    house: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selected: [],
      date: null
    }
  },
  methods: {
    async toLink() {
      const result = await post('/community-house/link-owner-house', {
        ownerId: this.selected[0].id,
        houseId: this.house.id,
        checkInDate: this.date
      })
      if (!result.success) {
        this.$message.error(result.message)
        return false
      }
      this.$emit('success')
      return true
    }
  }
}
</script>

<template>
  <snow-dialog-button v-if="house.status === 0" button-text="绑定" button-type="text" title="绑定业主" :dis-confirm="selected.length !== 1" :do-confirm="toLink">
    <el-form>
      <el-form-item label="入住日期">
        <el-date-picker v-model="date" :default-value="new Date()" value-format="yyyy-MM-dd" type="date" placeholder="选择入住日期，不填默认当天" />
      </el-form-item>
    </el-form>
    <snow-table
      query-api="/community-owner/page"
      :selected.sync="selected"
      :options="[
        {label:'姓名',prop:'name'},
        {label:'证件号码',prop:'idCard'},
        {label:'联系电话',prop:'phone'}
      ]"
    />
  </snow-dialog-button>
</template>

<style scoped lang="scss">

</style>
