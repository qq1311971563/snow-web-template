<script>
import SnowCrud from '@/snow-framework/components/SnowCrud.vue'

export default {
  name: 'SnowCrudDemo',
  components: { SnowCrud }
}
</script>

<template>
  <snow-crud
    :options="[
      {label:'名称',prop:'name', isSearch: true},
      {label:'性别',prop:'sex'},
      {label:'证件号',prop:'idCard'},
      {label:'年龄',prop:'age', type: 'number'},
      {label:'创建日期',prop:'createDate',type: 'date'}
    ]"
  />
</template>

<style scoped lang="scss">

</style>
