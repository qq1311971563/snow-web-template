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
      {label:'区域编码',prop:'code'},
      {label:'区域名称',prop:'name', isSearch: true},
      {label:'创建人',prop:'createName', showCreate: false, showUpdate: false},
      {label:'创建日期',prop:'createTime', type: 'date', showCreate: false, showUpdate: false}
    ]"
    query-api="/community-area/page"
    update-api="/community-area/update"
    create-api="/community-area/create"
    delete-api="/community-area/delete"
    del-prompt-key="name"
  />
</template>

<style scoped lang="scss">

</style>
