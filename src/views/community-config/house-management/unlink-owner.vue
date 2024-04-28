<script>
import SnowButton from '@/snow-framework/components/SnowButton.vue'

export default {
  name: 'UnlinkOwner',
  components: { SnowButton },
  props: {
    house: {
      type: Object,
      default: null
    }
  }
}
</script>

<template>
  <snow-button
    v-if="house.status === 1"
    type="text"
    api="/community-house/unlink-owner-house"
    :params="house.id"
    :confirm-text="`确定解绑房屋【${house.code}】的业主信息吗？`"
    @success="$emit('success')"
  >解绑</snow-button>
</template>

<style scoped lang="scss">

</style>
