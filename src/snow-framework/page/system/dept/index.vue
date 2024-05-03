<script>
import SnowCrud from '@/snow-framework/components/SnowCrud.vue'

export default {
  name: 'Index',
  components: { SnowCrud },
  data() {
    return {
    }
  }
}
</script>

<template>
  <snow-crud
    :options="[
      {label:'上级部门', prop: 'parentId', showView: false, type: 'dict',tree: true, api:'/system-dept/tree', dictLabel:'deptName'},
      {label: '系统ID', prop:'id', showCreate: false, showUpdate: false},
      {label:'部门名称', prop: 'deptName', isSearch: true},
      {label:'创建人', prop: 'createName', showCreate: false, showUpdate: false},
      {label:'创建时间', prop: 'createTime', showCreate: false, showUpdate: false}
    ]"
    row-key="id"
    query-api="/system-dept/tree"
    create-api="/system-dept/create"
    delete-api="/system-dept/delete"
    del-prompt-key="deptName"
    :page="false"
  />
</template>

<style scoped lang="scss">

</style>
