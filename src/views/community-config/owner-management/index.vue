<script>
import SnowCrud from '@/snow-framework/components/SnowCrud.vue'
import LinkOwner from '@/views/community-config/house-management/link-owner.vue'

export default {
  name: 'Index',
  components: { SnowCrud },
  computed: {
    LinkOwner() {
      return LinkOwner
    }
  }
}
</script>

<template>
  <snow-crud
    :options="[
      {label:'业主姓名',prop:'name', isSearch: true, check_xm: true},
      {label:'证件号码',prop:'idCard', isSearch: true, check_idcard: true},
      {label:'联系电话',prop:'phone', isSearch: true, check_phone:true},
      {label:'录入日期',prop:'createTime', type:'date', showCreate: false, showUpdate: false},
      {label:'录入人',prop:'createName', showCreate: false, showUpdate: false},
    ]"
    query-api="/community-owner/page"
    create-api="/community-owner/create"
    update-api="/community-owner/update"
    delete-api="/community-owner/delete"
    del-prompt-key="name"
  />
</template>

<style scoped lang="scss">

</style>
