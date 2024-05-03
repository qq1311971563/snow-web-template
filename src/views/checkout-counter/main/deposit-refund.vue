<script>
import SnowButton from '@/snow-framework/components/SnowButton.vue'

export default {
  name: 'DepositRefund',
  components: { SnowButton },
  props: {
    recordId: {
      type: Number,
      default: null
    },
    maxRefundMoney: {
      type: Number,
      default: 0
    },
    houseId: {
      type: Number,
      default: null
    },
    type: {
      type: Number,
      default: 1
    }
  },
  methods: {
  }
}
</script>

<template>
  <snow-button
    :disabled="maxRefundMoney <= 0"
    :class="type === 1? '': 'delete-button-color'"
    style="margin-left: 10px"
    :type="type === 1? 'danger': 'text'"
    api="/community-deposit-record/refund-deposit"
    confirm-text="确定对账户内余额进行退款吗？"
    :prompt="true"
    input-type="number"
    :params="{
      houseId: houseId,
      recordId: recordId,
      refundType: 1
    }"
    input-error-message="请输入正确的押金退回金额"
    :input-placeholder="`请输入退回金额（0-${maxRefundMoney}）`"
    prompt-value-key="money"
  >{{ type === 1? '现金退款' : '原路退款' }}</snow-button>
</template>

<style scoped lang="scss">

</style>
