<script>
import SnowCreate from '@/snow-framework/components/SnowCreate.vue'

export default {
  name: 'AddTempBill',
  components: { SnowCreate },
  props: {
    houseId: {
      type: Number,
      default: null
    }
  }
}
</script>

<template>
  <snow-create
    :value="{houseId: houseId}"
    :disabled="!houseId"
    create-api="/community-payment-bill/create-temp-bill"
    :options="[
      {label:'收费项',prop:'feeId',type: 'dict', api:'/community-fee-item/search', params: {type: 2}},
      {label:'数量',prop:'nums',type: 'number', min: 1, max: 1000, default: 1}
    ]"
    button-text="新增临时收费"
  />
</template>

<style scoped lang="scss">

</style>
