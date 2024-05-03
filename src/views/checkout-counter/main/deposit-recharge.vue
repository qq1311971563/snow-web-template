<script>
import SnowCreate from '@/snow-framework/components/SnowCreate.vue'
import { post } from '@/snow-framework/Request'

export default {
  name: 'DepositRecharge',
  components: { SnowCreate },
  props: {
    houseId: {
      type: Number,
      default: null
    }
  },
  methods: {
    async toCreate(val) {
      const result = await post('/community-deposit-record/pay-deposit', val)
      if (!result.success) {
        this.$message.error(result.message)
        return
      }
      this.$message.success('充值成功')
      this.$emit('success')
      return true
    }
  }
}
</script>

<template>
  <snow-create
    :value="{
      houseId:houseId
    }"
    :disabled="!houseId"
    :create-api="toCreate"
    button-text="押金缴纳"
    :options="[
      {label:'充值金额', prop:'money',type:'number', min: 1, max: 999999},
      {label:'支付方式', prop:'payType',type: 'dict', options: [{name:'现金',id:0},{name: '微信', id: 1},{name:'支付宝',id: 2}] },
    ]"
  />
</template>

<style scoped lang="scss">

</style>
