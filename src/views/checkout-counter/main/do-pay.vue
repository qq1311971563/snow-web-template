<script>
import SnowDialogButton from '@/snow-framework/components/SnowDialogButton.vue'
import SnowDict from '@/snow-framework/components/SnowDict.vue'
import { post } from '@/snow-framework/Request'

export default {
  name: 'DoPay',
  components: { SnowDict, SnowDialogButton },
  props: {
    payOrders: {
      type: Array,
      default: () => []
    },
    houseId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      payParams: {
        payType: 0
      }
    }
  },
  computed: {
    amount() {
      return this.payOrders.reduce((pre, cur) => {
        return pre + Number.parseFloat(cur.total)
      }, 0)
    }
  },
  methods: {
    async doConfirm() {
      if (this.payParams.payType === 0) {
        const ret = await this.$confirm('确认完成付款操作吗？', '提示', {
          type: 'warning',
          beforeClose: async(action, instance, done) => {
            if ((action === 'confirm')) {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              const result = await post('/community-payment-bill/cash-pay', {
                orderIds: this.payOrders.map(e => e.id),
                houseId: this.houseId,
                payType: 0
              })
              if (!result.success) {
                this.$message.error(result.message)
              } else {
                this.$message.success('缴费成功')
                this.$emit('success')
              }
              instance.confirmButtonText = '确定'
              instance.confirmButtonLoading = false
              if (result.success) {
                done()
              }
            } else {
              done()
            }
          }
        })
        return ret
      } else {
        this.$message.error('暂未开放的支付方式')
      }
      return false
    }
  }
}
</script>

<template>
  <snow-dialog-button :dis-confirm="payOrders.length <= 0" :append-to-body="false" button-text="立即支付" :do-confirm="doConfirm" title="收费确认" confirm-text="立即支付">
    <el-table :data="payOrders" style="min-height: 400px">
      <el-table-column label="序号" type="index" />
      <el-table-column label="账单名称" prop="name" />
      <el-table-column label="账单金额" prop="total" />
    </el-table>
    <div style="display: flex;flex-direction: column;justify-content: right;align-items: flex-end">
      <div style="margin: 10px;width: 400px;text-align: left"><span style="font-size: 24px">合计金额：<span style="color: red;font-weight: bold">{{ amount.toFixed(2) }}</span></span></div>
      <div style="margin: 10px;width: 400px;text-align: left;display: flex;align-items: center"><span style="font-size: 24px">支付方式：</span>
        <snow-dict v-model="payParams.payType" :options="[{name:'现金支付',id: 0},{name:'微信支付',id: 1},{name:'支付宝支付',id: 2}]" :clearable="false" />
      </div>
    </div>
  </snow-dialog-button>
</template>

<style scoped lang="scss">

</style>
