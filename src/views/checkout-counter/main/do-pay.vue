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
    },
    depositBalance: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      payParams: {
        payType: 0
      },
      useDeposit: false
    }
  },
  computed: {
    depositPayMoney() {
      if (!this.useDeposit) {
        return 0
      }
      const amount = this.payOrders.reduce((pre, cur) => {
        return pre + Number.parseFloat(cur.total)
      }, 0)
      return amount >= Number.parseFloat(this.depositBalance) ? Number.parseFloat(this.depositBalance) : amount
    },
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
                payType: 0,
                useDeposit: this.useDeposit
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
    },
    showBefore() {
      this.useDeposit = false
      return true
    }
  }
}
</script>

<template>
  <snow-dialog-button
    :disabled="!houseId || payOrders.length <= 0"
    :dis-confirm="!houseId || payOrders.length <= 0"
    :append-to-body="false"
    button-text="立即缴费"
    :show-before="showBefore"
    :do-confirm="doConfirm"
    title="收费确认"
    confirm-text="确认缴费"
  >
    <el-table :data="payOrders" style="min-height: 400px">
      <el-table-column label="序号" type="index" />
      <el-table-column label="账单名称" prop="name" />
      <el-table-column label="账单金额" prop="total" />
    </el-table>
    <el-row style="margin-top: 20px" :gutter="24">
      <el-col :span="12"><span style="font-size: 20px">押金余额：<span style="color: green;font-weight: bold">{{ depositBalance }}</span></span></el-col>
      <el-col :span="12"><span style="font-size: 24px">合计金额：<span style="color: black;font-weight: bold">{{ amount.toFixed(2) }}</span></span></el-col>
    </el-row>
    <el-row style="margin-top: 20px" :gutter="24">
      <el-col :span="12"><span style="font-size: 20px">押金支付金额：<span style="color: #F56C6C;font-weight: bold">{{ depositPayMoney ? depositPayMoney.toFixed(2) : 0.00 }}</span></span></el-col>
      <el-col :span="12"><span style="font-size: 24px">实收金额：<span style="color: red;font-weight: bold">{{ (amount - depositPayMoney).toFixed(2) }}</span></span></el-col>
    </el-row>
    <el-row style="margin-top: 20px" :gutter="24">
      <el-col :offset="12" :span="12">
        <span style="font-size: 24px">支付方式：</span>
        <snow-dict v-model="payParams.payType" :options="[{name:'现金支付',id: 0},{name:'微信支付',id: 1},{name:'支付宝支付',id: 2}]" :clearable="false" />
        <el-checkbox v-model="useDeposit" :disabled="Number.parseFloat(depositBalance) <= 0" style="margin-left: 4px">押金抵扣</el-checkbox>
      </el-col>
    </el-row>
  </snow-dialog-button>
</template>

<style scoped lang="scss">

</style>
