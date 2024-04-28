<script>
import SnowCrud from '@/snow-framework/components/SnowCrud.vue'

export default {
  name: 'Index',
  components: { SnowCrud },
  data() {
    return {
      testValue: ''
    }
  }
}
</script>

<template>
  <snow-crud
    :options="[
      {label:'部门名称', prop: 'deptName', isSearch: true},
      {label:'创建人', prop: 'createName'},
      {label:'创建时间', prop: 'createTime'}
    ]"
    query-api="/system-dept/page"
    :page="false"
  />
</template>

<style scoped lang="scss">

</style>
