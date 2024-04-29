<script>
import SnowButton from '@/snow-framework/components/SnowButton.vue'

export default {
  name: 'RemoveFeeItem',
  components: { SnowButton },
  props: {
    id: {
      type: Number,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  },
  methods: {
    refresh() {
      this.$emit('success')
    }
  }
}
</script>

<template>
  <snow-button type="text" api="/community-house/remove-fee-item" :params="id" :confirm-text="`确定移除该收费【${name}】项目吗？`" @success="refresh">
    <span class="delete-button-color">移除</span>
  </snow-button>
</template>

<style scoped lang="scss">
@import "~@/snow-framework/main.css";
</style>
