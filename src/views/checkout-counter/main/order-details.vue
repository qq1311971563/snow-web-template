<script>
import SnowDialogButton from '@/snow-framework/components/SnowDialogButton.vue'
import SnowTable from '@/snow-framework/components/SnowTable.vue'
import SnowButton from '@/snow-framework/components/SnowButton.vue'

export default {
  name: 'OrderDetails',
  components: { SnowButton, SnowTable, SnowDialogButton },
  props: {
    payOrderId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
    }
  },
  methods: {
    confirm() {
      return true
    },
    toRefresh() {
      this.$refs.table.refresh()
      this.$emit('success')
    }
  }
}
</script>

<template>
  <snow-dialog-button
    button-text="详情"
    button-type="text"
    title="收费订单详情"
    confirm-text="关闭详情"
  >
    <snow-table
      ref="table"
      query-api="/community-payment-bill/get-all-by-house-id"
      :query-params="{size: 10, payOrderId: payOrderId}"
      :page="false"
      :enable-action="true"
      :options="[
        {label: '账单名称', prop:'name'},
        {label: '费用类型',prop:'type', type: 'dict', options: [{name:'周期性收费',id:1},{name:'临时收费',id: 2}]},
        {label: '账单金额', prop:'total'},
        {label: '账单状态', prop:'payStatus', type: 'dict', options: [{name:'已取消',id: -1, tag: 'danger'},{name:'未支付',id: 0},{name:'已支付',id: 2},]},
        {label: '退费状态', prop:'refundStatus', type: 'dict', options: [{name:'未退款',id: 0},{name:'已退款',id: 2}]},
        {label: '创建时间', prop:'createTime', type: 'date'}
      ]"
    >
      <template v-slot:rowAction="{row}">
        <snow-button
          v-if="row.payStatus === 2 && row.refundStatus === 0"
          api="/community-payment-bill/refund-order-bill"
          type="text"
          :confirm-text="`确定退款【${row.name}】账单吗？`"
          :params="{billId: row.id, orderId: payOrderId}"
          :prompt="true"
          input-placeholder="请输入退款理由"
          prompt-value-key="refundReason"
          @success="toRefresh"
        >退款</snow-button>
      </template>
    </snow-table>
  </snow-dialog-button>
</template>

<style scoped lang="scss">

</style>
