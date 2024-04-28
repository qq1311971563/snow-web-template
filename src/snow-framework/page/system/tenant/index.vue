<script>
import SnowCrud from '@/snow-framework/components/SnowCrud.vue'

export default {
  name: 'Index',
  components: { SnowCrud }
}
</script>

<template>
  <snow-crud
    :options="[
      {label:'公司名称',prop:'companyName',isSearch:true},
      {label:'租户描述',prop:'descript',showOverflowTooltip: true, type: 'textarea' },
      {label:'联系人',prop:'name',isSearch:true,check_xm:true},
      {label:'联系电话',prop:'phone', check_phone: true},
      {label:'创建人',prop:'createName', showCreate: false, showUpdate: false},
      {label:'创建时间',prop:'createTime', type: 'datetime',showCreate: false,showUpdate: false}
    ]"
    query-api="/system-tenant/page"
    create-api="/system-tenant/create"
    update-api="/system-tenant/update"
    delete-api="/system-tenant/delete"
    del-prompt-key="companyName"
  />
</template>

<style scoped lang="scss">

</style>
