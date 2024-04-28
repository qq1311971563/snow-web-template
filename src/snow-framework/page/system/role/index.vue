<script>
import SnowCrud from '@/snow-framework/components/SnowCrud.vue'
import PermissionsSelect from '@/snow-framework/page/system/role/permissions-select.vue'

export default {
  name: 'Index',
  components: { SnowCrud },
  computed: {
    permissionsSelect() {
      return PermissionsSelect
    }
  }
}
</script>

<template>
  <div>
    <snow-crud
      :options="[
        {label:'角色名称',prop:'name',isSearch:true,},
        {label:'角色备注',prop:'remark',showOverflowTooltip: true, type: 'textarea' },
        {label:'权限信息',prop:'permissions',type: 'component', component: permissionsSelect, showView: false },
        {label:'创建人',prop:'createName', showCreate: false, showUpdate: false},
        {label:'创建时间',prop:'createTime', type: 'datetime',showCreate: false,showUpdate: false}
      ]"
      query-api="/system-role/page"
      create-api="/system-role/create"
      update-api="/system-role/update"
      delete-api="/system-role/delete"
      del-prompt-key="name"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
