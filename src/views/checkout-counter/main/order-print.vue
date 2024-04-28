<script>
import { post } from '@/snow-framework/Request'
import printJS from 'print-js'

export default {
  name: 'OrderPrint',
  props: {
    orderId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async toPrint(val) {
      this.loading = true
      const result = await post('/community-payment-order/get-print-pdf', val || this.orderId)
      this.loading = false
      if (!result.success) {
        this.$message.error(result.message)
      }
      printJS({
        printable: result.data,
        title: '订单详情',
        type: 'pdf',
        base64: true,
        onPrintDialogClose: () => {
          console.log('打印对话框已关闭')
        }
      })
    }
  }
}
</script>

<template>
  <el-button type="text" :loading="loading" @click="toPrint()">打印</el-button>
</template>

<style scoped lang="scss">

</style>
