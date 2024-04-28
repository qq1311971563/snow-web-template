<script>
export default {
  name: 'RemoveFeeItem',
  props: {
    houseId: {
      type: Number,
      default: null
    },
    feeItemId: {
      type: Number,
      default: null
    }
  },
  methods: {
    remove() {
      console.log('移除费用')
    }
  }
}
</script>

<template>
  <el-button type="text" @click="remove">移除</el-button>
</template>

<style scoped lang="scss">

</style>
